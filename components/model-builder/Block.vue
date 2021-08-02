<template>
    <div :id="'block' + this.id" ref="div" :class="containerClasses" @mousedown.prevent.stop.left="onMouseDown" :style="styles">
        <div class="blockTitle" @mousedown.prevent.stop.left="emitDrag">
            <span class="titleText" :title="plainTitle">
                <span v-show="invalid" class="invalid" title="Process or Collection not supported!">
                    <i class="fas fa-exclamation-triangle"></i>
                </span>
                {{ name }}
                <span v-if="showId" class="blockId">{{ id }}</span>
            </span>
            <div class="blockicon" @mousedown.prevent.stop.left="focus()">
                <span v-show="allowsDescription && !showDescriptionField" class="addDescription" title="Add description" @click.stop.prevent="addDescription()">
                    <i class="fas fa-comment-medical"></i>
                </span>
                <span v-show="allowsDelete" class="delete" title="Remove (DEL)" @click.stop.prevent="remove()">
                    <i class="fas fa-trash"></i>
                </span>
                <span v-show="allowsInfo" class="info" title="Details" @click.stop.prevent="showInfo()">
                    <i class="fas fa-info"></i>
                </span>
                <span v-show="allowsParameterChange" class="settings" :title="isParameter ? 'Edit parameter' : 'Change parameter values'" @click.stop.prevent="edit">
                    <i class="fas fa-sliders-h"></i>
                </span>
            </div>
        </div>
        <div class="inout">
            <div class="inputs">
                <BlockParameter v-for="(param, i) in parameters" :key="i" ref="parameters" :state="state" :value="args[param.name]" @input="value => updateArgument(param.name, value)" @edgesChanged="edgesChanged(param, $event)" v-bind="param" />
            </div>
            <div class="outputs">
                <BlockParameter ref="output" :state="state" :label="outputLabel" v-bind="output" @input="updateResult" />
            </div>
        </div>
        <textarea ref="descriptionField" v-if="showDescriptionField" :value="description" :readonly="!state.editable" class="editDescription" placeholder="Type description here..." @blur="updateDescription" @mousedown.stop=""></textarea>
    </div>
</template>

<script>
import BlockParameter from './BlockParameter.vue';
import Utils from '../../utils.js';
import { ProcessParameter } from '@openeo/js-commons';
import { Utils as PgUtils } from '@openeo/js-processgraphs';
import Config from './config.js';

/*
Events:

Emits locally:
- moved(x, y) - The block has been moved
- input(value) - The value has been updated
- move() - A block is now being moved
- mounted(node) - The block is now part of the DOM.
- unmounted(node) - The block not not part of the DOM anylonger.
*/

const defaultFontSize = 10;

export default {
    name: 'Block',
    components: {
        BlockParameter
    },
    props: {
        id: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        selected: {
            type: Boolean,
            default: false
        },
        position: {
            type: Array,
            required: true
        },
        process_id: {
            type: String
        },
        namespace: {
            type: String
        },
        description: {
            type: String,
            default: null
        },
        args: {
            type: Object,
            default: () => ({})
        },
        result: {
            type: Boolean,
            default: false
        },
        origin: {
            type: String,
            default: null
        },
        spec: {
            type: Object,
            default: () => null
        },
        state: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            showDescriptionField: false,
            drag: null // Is the user dragging ?
        };
    },
    watch: {
        'state.compactMode'() {
            this.$emit('moved', this.position);
        }
    },
    computed: {
        // Visualizations
        width() {
            let size = Config.blockWidth;
            if (this.parameters.length > 0) {
                return this.state.compactMode ? size.compactParams : size.normalParams;
            }
            else {
                return this.state.compactMode ? size.compact : size.normal;
            }
        },
        styles() {
            return {
                marginLeft: Math.round(this.state.center[0] + this.position[0] * this.state.scale) + 'px',
                marginTop: Math.round(this.state.center[1] + this.position[1] * this.state.scale) + 'px',
                fontSize: Math.round(this.state.scale * defaultFontSize) + 'px',
                width: Math.round(this.state.scale * this.width) + 'px',
            };
        },
        plainTitle() {
            return this.name + (!this.showId ? '' : ' ' + this.id);
        },
        name() {
            switch(this.type) {
                case 'process':
                    if (this.collectionId) {
                        return this.collectionId;
                    }
                    else {
                        return this.processId;
                    }
                case 'parameter':
                    return this.spec.name;
                default:
                    return this.id.substr(1);
            }
        },
        outputLabel() {
            if (this.result) {
                return "Result";
            }
            else if (this.isParameter) {
                return "Process Parameter";
            }
            else {
                return "";
            }
        },
        containerClasses() {
            var classes = ['block'];
            if (this.collectionId) {
                classes.push('block_collection');
            }
            else if (this.isParameter) {
                classes.push('block_argument');
            }
            if (this.result) {
                classes.push('block_result');
            }
            if (this.selected) {
                classes.push('block_selected');
            }
            if (this.invalid) {
                classes.push('block_invalid');
            }

            return classes;
        },
        invalid() {
            if (this.type !== 'process' || !this.$parent.hasProcesses) {
                // We can only check processes for validity
                // Also, don't check for validity if no processes to validate against are given
                return false;
            }
            else if (!this.processId) {
                return true;
            }

            // Check that the process exists
            if (!this.spec) {
                return true;
            }

            // Check that the collection exists
            if (this.processId === 'load_collection' && !Utils.isRef(this.args.id)) {
                for(let collection of this.$parent.collections) {
                    if (this.args.id === collection.id) {
                        return false;
                    }
                }
                return true;
            }

            return false;
        },
        processId() {
            if (this.type === 'process') {
                if (this.process_id) {
                    return this.process_id;
                }
                else if (Utils.isObject(this.spec) && this.spec.id) {
                    return this.spec.id;
                }
            }
            return null;
        },
        collectionId() {
            if (this.type === 'process' && this.processId === 'load_collection' && !Utils.isRef(this.args.id)) {
                return this.args.id;
            }
            return null;
        },
        isParameter() {
            return this.type === 'parameter';
        },
        allowsParameterChange() {
            if (this.isParameter) {
                return this.state.editable && !!this.$parent.supports('editParameter');
            }
            else {
                return this.parameters.filter(p => p.isEditable()).length > 0;
            }
        },
        allowsDelete() {
            return (this.state.editable && (!this.spec || (Utils.isObject(this.spec) && this.origin !== 'schema')));
        },
        allowsInfo() {
            if (this.collectionId) {
                return this.$parent.supports('showCollection');
            }
            else if (this.isParameter) {
                return Utils.isObject(this.spec) && this.$parent.supports('showParameter');
            }
            else {
                return this.$parent.supports('showProcess');
            }
        },
        allowsDescription() {
            // ToDo: Remove type restriction and store description for parameters.
            return (this.state.editable && this.type === 'process');
        },
        showId() {
            return (this.type !== 'parameter');
        },
        // Parameters and related
        hasParametersDefined() {
            return Boolean(Utils.isObject(this.spec) && Array.isArray(this.spec.parameters) && this.spec.parameters.length > 0);
        },
        parameters() {
            let names = [];
            let parameters = [];
            if (this.hasParametersDefined) {
                parameters = this.spec.parameters.map(p => new ProcessParameter(p));
                names = parameters.map(p => p.name);
            }
            if (Utils.size(this.args) > 0) {
                for(var key in this.args) {
                    if (!names.includes(key)) {
                        parameters.push(new ProcessParameter({
                            name: key,
                            description: ''
                        }));
                    }
                }
            }
            return parameters;
        },
        fields() {
            var fields = {};
            for(var p of this.parameters) {
                fields[p.name] = p;
            }
            fields.output = this.output;
            return fields;
        },
        output() {
            var spec = {};
            if (Utils.isObject(this.spec)) {
                if (this.isParameter) {
                    spec = this.spec;
                }
                else if (Utils.isObject(this.spec.returns)) {
                    spec = this.spec.returns;
                }
            }
            var output = {
                name: "output",
                schema: spec.schema || {},
                description: spec.description || '',
                optional: true,
                output: true,
                value: {}
            };
            if (this.isParameter) {
                output.value.from_parameter = this.id.substr(1);
            }
            else {
                output.value.from_node = this.id.substr(1);
            }
            return output;
        }
    },
    mounted() {
        // ToDo: Move mousemove listener for dragging to Blocks?
        this.draggingFn = this.dragging.bind(this);
        document.addEventListener('mousemove', this.draggingFn);
        // ToDO: Replace with mouseleave?
        this.stopDragFn = this.stopDrag.bind(this);
        document.addEventListener('mouseup', this.stopDragFn);

        this.$emit('mounted', this);
    },
    beforeDestroy() {
        document.removeEventListener('mousemove', this.draggingFn);
        document.removeEventListener('mouseup', this.stopDragFn);

        this.$emit('unmounted', this);
    },
    methods: {
        edit() {
            if (this.isParameter) {
                this.editParameter();
            }
            else {
                this.showArguments();
            }
        },
        hasParameter(name) {
            return this.hasParametersDefined && !!this.spec.parameters.find(p => p.name === name);
        },
        updateDescription(event) {
            let value;
            if (typeof event.target.value === 'string' && event.target.value.length > 0) {
                value = event.target.value;
            }
            else {
                value = null;
            }
            this.showDescriptionField = (value !== null);
            if (this.description !== value) {
                this.$emit('update', 'description', value);
            }
        },
        updatePosition(pos, saveHistory = true) {
            pos = Utils.ensurePoint(pos);
            if (this.position[0] !== pos[0] || this.position[1] !== pos[1]) {
                this.$emit('update', 'position', pos, saveHistory);
            }
        },
        updateArguments(value) {
            let removeParameters = Object.keys(this.args)
                    .filter(key => typeof value[key] === 'undefined' && (!this.hasParametersDefined || this.hasParameter(key)));
            this.$emit('update', 'arguments', value, removeParameters);
        },
        updateArgument(key, value) {
            let args = Utils.deepClone(this.args);
            args[key] = value;
            this.updateArguments(args);
        },
        updateResult(value) {
            if (this.hasOutputEdges()) {
                this.state.root.$emit("error", "A result node can't have outgoing edges.");
                return;
            }
            if (value !== this.result) {
                this.$emit('update', 'result', value);
            }
        },
        focus() {
            this.$parent.focus();
        },
        onMouseDown(event) {
            this.select(!this.selected, !event.shiftKey);
        },
        select(selected = true, unselectOthers = true) {
            this.$emit('update', 'selected', selected, unselectOthers);
            this.focus();
        },
        getDimensions() {
            let dim = Utils.domBoundingBox(this.$refs.div);
            var blocksDim = this.$parent.getDimensions();
            dim.x = dim.offsetLeft-blocksDim.offsetLeft;
            dim.y = dim.offsetTop-blocksDim.offsetTop;
            return dim;
        },
        edgesChanged(parameter, edges) {
            parameter.refs = edges.map(edge => edge.parameter1.value);
        },
        editParameter() {
            this.$parent.$emit('editParameter', this.spec, "Edit Parameter: " + this.plainTitle, data => this.$emit('update', 'spec', data));
        },
        showArguments(parameterName = null) {
            this.$parent.$emit('editArguments', this.parameters.filter(p => p.isEditable()), this.args, this.plainTitle, this.state.editable, parameterName, data => this.updateArguments(data), this);
        },
        showInfo() {
            if(this.collectionId) {
                this.$parent.$emit('showCollection', this.collectionId);
            }
            else if (this.isParameter) {
                this.$parent.$emit('showParameter', this.spec);
            }
            else {
                this.$parent.$emit('showProcess', this.processId);
            }
        },
        async addDescription() {
            this.select();
            this.showDescriptionField = true;
            await this.$nextTick();
            this.$refs.descriptionField.focus();
        },
        async emitDrag(event) {
            this.select(true, !event.shiftKey);
            this.focus();
            await this.$nextTick();
            this.$emit('move', event);
        },
        getDragPos(pos, mouse) {
            return [mouse[0]/this.state.scale-pos[0], mouse[1]/this.state.scale-pos[1]];
        },
        startDrag(event) {
            if (!this.selected) {
                return;
            }

            let mousePos = this.$parent.getMousePos(event);
            this.drag = {
                origin: this.position,
                mouse: this.getDragPos(this.position, mousePos)
            };
        },
        stopDrag(event) {
            if (!this.drag) {
                return;
            }

            var delta = 5 / this.state.scale; // Only store History if block was moved enough
            if (Math.abs(this.drag.origin[0] - this.position[0]) > delta || Math.abs(this.drag.origin[1] - this.position[1]) > delta) {
                this.updatePosition(this.position);
            }
            this.drag = null;
        },
        dragging(event) {
            if (!this.drag) {
                return;
            }
            
            let mousePos = this.$parent.getMousePos(event);
            let drapPos = this.getDragPos(this.drag.mouse, mousePos);
            // Don't store for each run a history step...
            this.updatePosition(drapPos, false);
        },

        hasOutputEdges() {
            return this.$refs.output && this.$refs.output.getEdgeCount() > 0;
        },

        async remove() {
            await this.$parent.removeBlock(this);
        },

        /**
         * Getting a field by name
         */
        getBlockParameter(name) {
            if (name === 'output' && this.$refs.output) {
                return this.$refs.output;
            }
            else if (Array.isArray(this.$refs.parameters)) {
                var params = this.$refs.parameters.filter(param => param.name === name);
                if (params.length > 0) {
                    return params[0];
                }
            }
            return null;
        },
        hiddenParameterRef(parameterBlock) {
            if (this.type !== 'process') {
                return null;
            }
            for (let param in this.args) {
                let value = this.args[param];
                if (Utils.isObject(value) && Utils.isObject(value.process_graph)) {
                    let refs = PgUtils.getRefs(value, true, true);
                    if (refs.find(r => r.from_parameter === parameterBlock.id.substr(1))) {
                        return param;
                    }
                }
            }
            return null;
        }
    }

}
</script>

<style lang="scss">
.vue-component.model-builder {
    .block {
        position:absolute;
        border:2px solid #ccc;
        margin-left:0px;
        margin-top:0px;
        background-color:#fafafa;
        opacity:0.8;
        font-size:14px;
        user-select:none;
        -moz-user-select:none;
        -khtml-user-select:none;
        -webkit-user-select:none;
        -o-user-select:none;

        .description {
            display:none;
            width:200px;
            padding:3px;
            border:1px solid #083776;
            border-radius:5px;
            color:#001531;
            background-color:#91bcf6;
            margin-top:15px;
            position:absolute;
            font-weight:normal;
        }

        .blockTitle {
            display: flex;
            padding: 0.3em 0.1em;
            font-weight:bold;
            background-color:#ddd;
            margin-bottom: 0.1em;
            cursor: move;
            font-size: 0.9em;
            
            .blockId {
                opacity:0.4;
                margin-left: 2px;
            }

            .titleText {
                flex-grow: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .blockicon {
                white-space: nowrap;
                text-align: center;

                i.fas {
                    min-width: 1.4em;
                    cursor: pointer;
                    opacity: 0.5;
                    margin-left: 0.1em;

                    &:hover {
                        opacity:1.0;
                    }
                }
            }
        }

        .invalid {
            color: red;
        }

        .inout {
            display: flex;
        }

        .inputs {
            flex-grow: 1;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .editDescription {
            padding: 0.3em 0.2em;
            box-sizing: border-box;
            font-size: 0.9em;
            line-height: 1em;
            overflow: auto;
            border: 0;
            border-top: 1px dotted #ccc;
            background-color: transparent;
            width: 100%;
            max-width: 100%;
            height: 3.7em;
            min-height: 2.5em;
            resize: none;

            &:focus {
                outline: 0;
            }
        }
    }

    .block_collection {
        border:2px solid #6B8DAF;

        .blockTitle {
            background-color:#A3B7CC;
        }
        .field_id { /* Hide collection ID as it's shown in the title */
            display: none;
        }
    }

    .block_result {
        border:2px solid #888;

        .field_output .circle {
            background-color: #888;
            cursor: auto;
        }
    }

    .block_argument {
        border:2px solid #B28C6B;

        .blockTitle {
            background-color:#CCB7A3;
        }
    }

    .block_selected {
        border:2px solid #0a0 !important; /* important is used to override the styles for block_collection and block_argument above */

        .blockTitle {
            background-color:#0c0 !important;
        }
    }

    .block_invalid {
        border:2px solid #ff0000 !important; /* important is used to override the styles for block_selected above */
    }
}
</style>