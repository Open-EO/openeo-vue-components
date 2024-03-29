<template>
    <div :class="classes">
        <div v-if="!output" ref="circle" :class="circleClasses" v-on="circleListeners"></div>
        <span class="text" v-on="textListeners">
            <span v-show="unspecified" class="unspecified" title="Parameter is likely unsupported!">
                <i class="fas fa-exclamation-triangle"></i>
            </span>
            <span class="label">{{ displayLabel }}</span><template v-if="displayValue.length">: </template>
            <span class="value" v-html="displayValue"></span>
        </span>
        <div v-if="output" ref="circle" :class="circleClasses" v-on="circleListeners" title="Output of the process"></div>
    </div>
</template>

<script>
import { ProcessSchema } from '@openeo/js-commons';
import { ProcessGraph } from '@openeo/js-processgraphs';
import Utils from '../../utils.js';

export default {
    name: 'BlockParameter',
    props: {
        name: {
            type: String,
            default: 'output'
        },
        description: {
            type: String,
            default: ''
        },
        optional: {
            type: Boolean,
            default: false
        },
        deprecated: {
            type: Boolean,
            default: false
        },
        experimental: {
            type: Boolean,
            default: false
        },
        default: {},
        value: {},
        schema: {
            type: [Object, Array],
            default: null
        },
        label: {
            type: String
        },
        output: {
            type: Boolean,
            default: false
        },
        state: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            // The attached edges
            edges: []
        };
    },
    computed: {
        schemas() {
            if (this.schema instanceof ProcessSchema) {
                return this.schema;
            }
            else {
                return new ProcessSchema(this.schema);
            }
        },
        hasValue() {
            return (this.value !== undefined);
        },
        textListeners() {
            if (this.allowsArgumentChange) {
                return {
                    click: this.openEditorForArguments
                };
            }
            else {
                return {};
            }
        },
        circleListeners() {
            var listeners = {};
            if (this.state.editable) {
                listeners.mousedown = event => {
                    if (event.which == 1) {
                        this.state.root.link(this);
                        event.preventDefault();
                        event.stopPropagation();
                    }
                };

                if (this.output) {
                    // Allow specifying the result node
                    listeners.dblclick = event => {
                        if (event.which == 1) {
                            this.$emit('input', true);
                        }
                    };
                }

                // Handle focus on the I/Os
                listeners.mouseover = () => this.state.linkFrom && this.state.root.link(this);
                listeners.mouseout = () => this.state.linkTo && this.state.root.unlink(this);
            }
            return listeners;
        },
        classes() {
            let classes = [
                this.output ? 'output' : 'input',
                'connector',
                'field_' + this.name,
                (this.hasValue || this.optional || this.output || this.getEdgeCount() > 0) ? 'hasValue' : 'noValue',
            ];
            if (this.allowsArgumentChange) {
                classes.push("editable");
            }
            return classes;
        },
        unspecified() {
            return !this.$parent.invalid && this.state.root.hasProcesses && this.schemas.unspecified;
        },
        circleClasses() {
            var classes = ['circle'];
            if (this.getEdgeCount() > 0) {
                classes.push('io_active');
            }

            for (var edge of this.edges) {
                if (edge.selected) {
                    classes.push('io_selected');
                }
                else if (edge.issues.length > 0) {
                    classes.push('io_issues');
                }
            }

            if (this.state.linkFrom == this || this.state.linkTo == this) {
                classes.push('io_selected');
            }
            return classes;
        },
        displayValue() {
            var maxLength = 38 - this.displayLabel.length;
            var formattedValue = null;
            if (this.isEditable && !this.state.compactMode && !Utils.isRef(this.value)) {
                let value = typeof this.value !== 'undefined' ? this.value : this.default;
                if (typeof value !== 'undefined') {
                    formattedValue = this.formatValue(value, maxLength, true);
                }
            }

            if (typeof formattedValue === 'string') {
                if (formattedValue.length === 0) {
                    formattedValue = '<em>Empty</em>';
                }
            }
            else {
                formattedValue = '';
            }
            return formattedValue;
        },
        displayLabel() {
            if (this.output && this.state.compactMode) {
                return '';
            }
            else if (typeof this.label === 'string' && (this.label.length > 0 || this.output)) {
                return this.label;
            }
            else {
                return this.name;
            }
        },
        isArrayType() {
            return this.schemas.nativeDataType() === 'array';
        },
        isObjectType() {
            return this.schemas.nativeDataType() === 'object';
        },
        isEditable() {
            return !this.output && this.schemas.isEditable();
        },
        allowsArgumentChange() {
            return (!this.output && this.schemas.isEditable());
        },
        allowsMultipleInputs() {
            // Is there any type that potentially allows multiple inputs?
            return this.isArrayType || this.isObjectType || this.schemas.nativeDataType() === 'any';
        },
    },
    watch: {
        edges() {
            this.updateEdgeStatus();
            this.$emit('edgesChanged', this.edges, this);
        },
        value: {
            immediate: true,
            handler() {
                this.updateEdgeStatus();
            }
        }
    },
    methods: {
        updateEdgeStatus() {
            if (!this.output) {
                for(var edge of this.edges) {
                    edge.inactive = !this.isEdgeUsed(edge);
                }
            }
        },
        getCirclePosition() {
            try {
                var dim = this.state.root.domBoundingBox(this.$refs.circle);
                var blocksDim = this.state.root.getDimensions();
                var x = (dim.offsetLeft - blocksDim.offsetLeft) + dim.width / 2;
                var y = (dim.offsetTop - blocksDim.offsetTop) + dim.height / 2;
                return [x, y];
            } catch (error) {
                console.warn(error);
                return null;
            }
        },
        openEditorForArguments() {
            if (this.allowsArgumentChange) {
                this.$parent.showArguments(this.name);
            }
        },
        jsonSchema() {
            return this.schemas.toJSON();
        },
        setValue(value) {
            if (this.schemas.nativeDataType() == 'boolean' && !Utils.isRef(value)) {
                value = !!value;
            }
            this.$emit('input', value);
        },
        resetValue() {
            if (typeof this.default !== 'undefined') {
                this.setValue(this.default);
                return;
            }
            
            var value;
            if (this.schemas.nullable()) {
                value = null;
            }
            else {
                var dataType = this.schemas.nativeDataType();
                switch(dataType) {
                    case 'object':
                        value = {};
                        break;
                    case 'array':
                        value = [];
                        break;
                    case 'string':
                        value = '';
                        break;
                    case 'integer':
                    case 'number':
                        value = 0;
                        break;
                    case 'boolean':
                        value = false;
                        break;
                    default:
                        value = undefined;
                }
            }
            this.setValue(value);
        },
        getEdgeRef(edge) {
            if (this.output) {
                return this.value;
            }
            else {
                return edge.parameter1.value;
            }
        },
        addRefToValue(edge) {
            var ref = this.getEdgeRef(edge);
            if (!ref) {
                return;
            }
            else if (!this.allowsMultipleInputs) {
                this.setValue(ref);
            }
            else if (this.isArrayType) {
                if (Utils.isRef(this.value)) {
                    this.setValue([this.value, ref]);
                }
                else if (Array.isArray(this.value) && this.value.length > 0) {
                    var value = this.value;
                    value.push(ref);
                    this.setValue(value);
                }
                else {
                    this.setValue(ref);
                }
            }
            else if (this.isObjectType) {
                var propertyCount = Utils.size(this.value);
                if (this.getEdgeCount() === 1 && (!this.hasValue || !propertyCount)) {
                    this.setValue(ref);
                }
                else if (!propertyCount) {
                    this.resetValue();
                }
                else {
                    // Don't change value
                }
            }
            else {
                // ToDo: This is probably of data type mixed or any, how to handle?
                this.setValue(ref);
            }
        },
        removeRefFromValue(edge) {
            if (!this.output) {
                var ref = this.getEdgeRef(edge);
                if (Utils.isRefEqual(ref, this.value)) {
                    this.resetValue();
                }
                else if (this.isArrayType || this.isObjectType) {
                    this.setValue(this.removeRefFromValueDeep(this.value, ref));
                }
            }
        },
        removeRefFromValueDeep(value, ref) {
            if (Array.isArray(value)) {
                var i = value.length;
                while(--i >= 0) {
                    if (value[i] === null || typeof value[i] !== 'object') {
                        continue;
                    }
                    else if (Utils.isRefEqual(ref, value[i])) {
                        value.splice(i, 1);
                    }
                    else {
                        value[i] = this.removeRefFromValueDeep(value[i], ref);
                    }
                }

            }
            else if (Utils.isObject(value)) {
                for(var key in value) {
                    if (!value.hasOwnProperty(key) || value[key] === null || typeof value[key] !== 'object') {
                        continue;
                    }
                    else if (Utils.isRefEqual(ref, value[key])) {
                        delete value[key];
                    }
                    else {
                        value[i] = this.removeRefFromValueDeep(value[key], ref);
                    }
                }
            }
            return value;
        },
        addEdge(edge) {
            this.edges.push(edge);
            if (!this.isEdgeUsed(edge) && !this.output) {
                this.addRefToValue(edge);
            }
        },
        eraseEdge(edge) {
            for (var k in this.edges) {
                if (this.edges[k] == edge) {
                    this.removeRefFromValue(edge);
                    this.$delete(this.edges, k);
                    return true;
                }
            }
            return false;
        },
        isEdgeUsed(edge) {
            var ref = this.getEdgeRef(edge);
            if (Utils.isRefEqual(ref, this.value)) {
                return true;
            }
            return this.hasRefInValue(ref, this.value);
        },
        hasRefInValue(ref, value) {
            if (!value || typeof value !== 'object') {
                return false;
            }
            else if (Utils.isRefEqual(ref, value)) {
                return true;
            }
            for(let key in value) {
                if (this.hasRefInValue(ref, value[key])) {
                    return true;
                }
            }
            return false;
        },
        getEdgeCount() {
            return this.edges.length;
        },
        formatProcess(pg, maxLength) {
            if (pg instanceof ProcessGraph && pg.getNodeCount() === 1) {
                return this.formatValue(pg.getResultNode().process_id, maxLength);
            }
            var nodes = Object.values(pg.process_graph);
            if (nodes.length === 1) {
                return this.formatValue(nodes[0].process_id, maxLength);
            }
            else {
                return 'Process';
            }
        },
        formatValue(value, maxLength, html = true) {
            if (typeof value === 'object') {
                if (value === null) {
                    return 'n/a';
                }
                else if (Array.isArray(value)) {
                    return this.formatArray(value, maxLength, html);
                }
                else {
                    return this.formatObject(value, maxLength, html);
                }
            }
            else if (typeof value === 'string') {
                if (value.length > maxLength) {
                    var text = Utils.htmlentities(value.substr(0, maxLength));
                    return html ? text + '<span title="' + Utils.htmlentities(value) + '">…</span>' : text;
                }
                else {
                    return Utils.htmlentities(value);
                }
            }
            else if (typeof value === 'boolean') {
                return value ? '✔️' : '❌';
            }
            else if (typeof value === 'number') {
                return value.toString();
            }
            else {
                return Utils.htmlentities(JSON.stringify(value));
            }
        },
        formatArray(values, maxLength, html = true) {
            let parts = [];
            for(let i in values) {
                let value = values[i];
                let formatted = this.formatValue(value, 10, html);
                let unformatted = Utils.htmlentities_decode(this.formatValue(value, 10, false));

                if (unformatted.length > maxLength) {
                    if (parts.length === 0) {
                        return this.formatArraySimple(values, 'List(' + values.length + ')');
                    }
                    else {
                        parts.push(this.formatArraySimple(values, '…'));
                        break;
                    }
                }

                parts.push(formatted);
                maxLength -= unformatted.length + 2;
            }
            
            return parts.join(", ");
        },
        formatArraySimple(values, text, html = true) {
            if (html && values.length < 10) {
                let title = values.map(v => this.formatValue(v, 25, false)).join(', ');
                return '<span title="' + title + '">' + text + '</span>';
            }
            else {
                return text;
            }
        },
        formatObject(value, maxLength, html = true) {
            if (Object.keys(value).length === 0) {
                return 'None';
            }
            else if (value instanceof ProcessGraph || Utils.isObject(value.process_graph)) {
                return this.formatProcess(value, maxLength);
            }
            else if (Utils.isRef(value)) {
                return this.formatValue(Utils.formatRef(value), maxLength);
            }
            else if (typeof value.west !== 'undefined' && typeof value.east !== 'undefined' && typeof value.south !== 'undefined' && typeof value.north !== 'undefined') {
                return maxLength >= 12 ? 'Bounding Box' : 'BBox';
            }
            else if (Utils.detectGeoJson(value)) {
                return this.formatValue(value.type, maxLength);
            }

            // Fallback to default
            return html ? '<span title="' + Utils.htmlentities(JSON.stringify(value)) + '">Object</span>' : 'Object';
        }
    }
}
</script>

<style lang="scss">
.vue-component.model-builder {
    .block .connector {
        font-size: 0.9em;
        margin: 0.2em 0;
        white-space: nowrap;
        
        &.noValue {
            color: red;
        }
        &.editable .label,
        &.editable .value {
            cursor: pointer;
        }
        span[title] {
            cursor: help;
        }
        .input {
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .output {
            text-align: right;
        }
        .unspecified {
            color: red;
            margin-right: 0.3em;
        }
        .circle {
            width: 0.8em;
            height: 0.8em;
            margin: 0 0.2em;
            border: 1px solid #888;
            background-color: transparent;
            display: inline-block;

            &.io_active {
                background-color: #FFC800;
            }
            &.io_selected {
                background-color: #00C800 !important;
            }
            &.io_issues {
                background-color: #FF0000;
            }
        }
    }

    &.editable .circle {
        cursor: pointer;
    }
}
</style>