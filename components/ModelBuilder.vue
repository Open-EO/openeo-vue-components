<template>
    <div ref="div" :id="id" :class="classes" tabindex="0"
        @mousemove="onMouseMove"
        @mousedown="onMouseDown"
        @wheel="onMouseWheel"
        @keydown="onKeyDown"
        @focus="hasFocus = true"
        @blur="hasFocus = false">
        <!-- tabindex is to allow focus for delete keystroke etc -->
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="canvas">
            <Edge v-for="edge in edges" :key="edge.id" :id="edge.id"
                :parameter1="edge.parameter1" :parameter2="edge.parameter2"
                :selected="edge.selected" :inactive="edge.inactive" :issues="edge.issues" :state="state"
                @mounted="node => mount(edge, node)" @unmounted="() => mount(edge)"
                @position="updateEdgePos(edge, arguments)" />
            <Edge v-for="edge in hiddenParameterRefEdges" :key="edge.id" :id="edge.id"
                :parameter1="edge.parameter1" :parameter2="edge.parameter2"
                @mounted="node => mount(edge, node)" @unmounted="() => mount(edge)"
                :inactive="true" :lineColor="[200,200,200,1]" :lineWidth="2" :state="state" />
            <line v-if="linkingLine" v-bind="linkingLine" />
            <rect v-if="selectRect" v-bind="selectRect" />
        </svg>
        <div class="blocks">
            <Block v-for="(block) in blocks" :key="block.id"
                :id="block.id" :type="block.type" :spec="block.spec" :state="state"
                :selected="block.selected" :position="block.position" :origin="block.origin"
                :process_id="block.process_id" :namespace="block.namespace" :result="block.result" :args="block.arguments" :description="block.description" 
                @update="(...args) => updateBlock(block, ...args)"
                @mounted="node => mount(block, node)" @unmounted="() => mount(block)"
                @move="startDragBlock" />
        </div>
        <div v-if="state.scale < 0.7 || showZoomInfo" class="zoomInfo">
            <div v-if="state.scale < 0.7">
                Zoom in for more details.
            </div>
            <div v-if="showZoomInfo">
                Zoom with <kbd>STRG</kbd> or <kbd>Meta</kbd> key and the mouse wheel.
            </div>
        </div>
        <ParameterViewer v-if="parameterViewer" v-bind="parameterViewer" @close="parameterViewer = null" />
    </div>
</template>

<script>
import Block from './model-builder/Block.vue';
import Edge from './model-builder/Edge.vue';
import Utils from '../utils.js';
import { ProcessRegistry } from '@openeo/js-commons';
import { JsonSchemaValidator, ProcessGraph, Utils as PgUtils } from '@openeo/js-processgraphs';
import Vue from 'vue';
import boxIntersectsBox from 'intersects/box-box';
import boxIntersectsLine from 'intersects/box-line';
import Config from './model-builder/config.js';

const getDefaultState = function(blocks) {
    return Vue.observable({
        root: blocks,
        editable: false,
        compactMode: false,
        moving: null, // Is the user dragging the view?
        selecting: null, // Is the user multi-selecting?
        center: [0,0],
        mouse: [0,0],
        scale: Config.defaultScale,
        linkFrom: null, // Array
        linkTo: null // Array
    });
};
const MARGIN = 20;

const selectionChangeWatcher = function (newVal, oldVal) {
    if (!Array.isArray(newVal) || !Array.isArray(oldVal) || newVal.length !== oldVal.length || !newVal.every((value,i) => value.id === oldVal[i].id)) {
        this.$emit('selectionChanged', this.selectedBlocks, this.selectedEdges);
    }
};

export default {
    name: 'ModelBuilder',
    components: {
        Block,
        Edge,
        ParameterViewer: () => import('./model-builder/ParameterViewer.vue')
    },
    props: {
        id: {
            type: String,
            required: true
        },
        editable: {
            type: Boolean,
            default: false
        },
        value: {
            type: Object,
            default: () => ({})
        },
        collections: {
            type: Array,
            default: () => []
        },
        processes: {
            type: [Array, Object],
            default: () => []
        },
		parent: {
			type: Object,
			default: null
		},
		parentSchema: {
			type: Object,
			default: null
		},
        historySize: {
            type: Number,
            default: 30
        },
        explicitZoom: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isMounted: false,
            allMounted: false,

            // Current offset for block that are generated without specific coordinates so that not all block occur on the same position
            newBlockOffset: 0,

            // History
            history: [],
            historyPointer: null,

            process: this.value,
            // Metadata for blocks to show
            blocks: [],
            // Metadata for edges to show
            edges: [],
            hiddenParameterRefEdges: {},

            processGraph: null,

            // Next block id
            nextBlockId: 1,
            // Next edge id
            nextEdgeId: 1,
            // Copy&Paste
            clipboard: null,

            activeTransactions: 0,
            hasFocus: false,
            linkingLine: null,
            parameterViewer: null,

            showZoomInfo: this.explicitZoom,
            
            // State specific to this blocks instance including all children
            state: getDefaultState(this)
        };
    },
    computed: {
        classes() {
            let classes = [
                'vue-component',
                'model-builder'
            ];
            if (this.hasFocus) {
                classes.push('focus');
            }
            if (this.editable) {
                classes.push('editable');
            }

            if (this.state.compactMode) {
                classes.push('compact');
            }

            if (this.state.scale < 0.5) {
                classes.push('scale_xs');
            }
            else if (this.state.scale < 0.7) {
                classes.push('scale_s');
            }
            else if (this.state.scale < 0.9) {
                classes.push('scale_m');
            }
            else if (this.state.scale < 1.1) {
                classes.push('scale_l');
            }
            else {
                classes.push('scale_xl');
            }

            return classes;
        },
        selectRect() {
            if (!this.state.selecting) {
                return null;
            }
            return {
                x: Math.min(this.state.selecting.current[0], this.state.selecting.start[0]),
                y: Math.min(this.state.selecting.current[1], this.state.selecting.start[1]),
                width: Math.abs(this.state.selecting.current[0] - this.state.selecting.start[0]),
                height: Math.abs(this.state.selecting.current[1] - this.state.selecting.start[1]),
                'stroke': 'rgba(0,0,0,0.8)',
                'stroke-width': 1,
                'fill': 'rgba(0,0,0,0.05)'
            };
        },
        processRegistry() {
            // If I link between openeo-web-editor and openeo-vue-components, instanceof ProcessRegistry fails.
            // Webpack seems to mangle names and thus I need to check for specific processes alternatively to detect whether this could be a ProcessRegistry.
            if (this.processes instanceof ProcessRegistry || (typeof this.processes.count === 'function' && typeof this.processes.get === 'function')) {
                return this.processes;
            }
            else if (Array.isArray(this.processes)) {
                return new ProcessRegistry(this.processes);
            }
            else {
                throw new Error('Invalid processes specified, must be ProcessRegistry or Array');
            }
        },
        hasProcesses() {
            return this.processRegistry.count() > 0;
        },
        processBlocks() {
            return this.blocks.filter(b => b.type === 'process');
        },
        selectedBlocks() {
            return this.blocks.filter(block => block.selected);
        },
        selectedEdges() {
            return this.edges.filter(edge => edge.selected);
        },
        selectedSideEdge() {
            if (this.selectedEdges.length === 1 && this.selectedEdges[0].selectedParameter) {
                return this.selectedEdges[0];
            }
            return null;
        },
        hasSelection() {
            return this.selectedBlocks.length > 0 || this.selectedEdges.length > 0;
        },
        processParametersFromSchemas() {
            // Get all process parameters from the parent process
            // this.parent.$parent => ModelBuilder instance
			let parentParams = [];
			if (this.parent && this.parent.$parent && typeof this.parent.$parent.getPgParameters === 'function') {
				parentParams = this.parent.$parent.getPgParameters().map(block => block.spec);
			}

            let callbackParams = [];
            // If we have a parameter schema given, go through the parameter schema and get the available process parameters from there.
            if (this.parentSchema) {
			    callbackParams = this.parentSchema.getCallbackParameters();
            }

            // Remove all parameters from the parent that are overridden by the more specific parameters.
            let filteredParentParams = parentParams.filter(p1 => !callbackParams.find(p2 => p1.name === p2.name));
            // Add the filtered parameters from the parent to the more specific parameters
            return callbackParams.concat(filteredParentParams);
        }
    },
    watch: {
        parentSchema() {
            this.importPgParameters(this.processParametersFromSchemas, 'schema');
        },
        async value(value) {
            // Only run if component has been mounted
            if (!this.allMounted) {
                return;
            }

            // Only import when user changes data (i.e. not a BlocksProcess exported from export())
            if (!(value instanceof BlocksProcess)) {
                this.process = value;
                await this.import(value, { propagate: false, undoOnError: false }); // don't propagate, otherwise results in an infinite loop
            }
        },
        editable: {
            immediate: true,
            handler(editable) {
                this.state.editable = editable;
            }
        },
        selectedEdges: selectionChangeWatcher,
        selectedBlocks: selectionChangeWatcher,
        allMounted() {
            this.updateHiddenParameterRefEdges();
        },
        isMounted() {
            this.checkAllMounted();
        }
    },
	beforeCreate() {
		Utils.enableHtmlProps(this);
	},
    async created() {
        if (!this.supports('error')) {
            // Print error to console if event is not supported by implementing context
            this.$on('error', (msg, title = null) => console.error(msg, title));
        }
        if (!this.supports('editArguments')) {
            this.$on('editArguments', (...args) => this.showParameterViewer(...args));
        }
    },
    async mounted() {
        Utils.loadFontAwesome(this);

        // Setting up default viewer center
        this.moveCenter(0, 0, true);

        // ToDo: Replace with mouseleave?
        this.onDocumentMouseUpFn = this.onDocumentMouseUp.bind(this)
        document.addEventListener('mouseup', this.onDocumentMouseUpFn);

        await this.importPgParameters(this.processParametersFromSchemas, 'schema');
        if (!await this.import(this.value, { propagate: false, undoOnError: false })) {
            this.perfectScale();
        }
        selectionChangeWatcher.bind(this)();

        this.isMounted = true;
    },
    beforeDestroy() {
        document.removeEventListener('mouseup', this.onDocumentMouseUpFn);
    },
    methods: {
        updateEdgePos(edge, pos) {
            edge.position1 = pos[0];
            edge.position2 = pos[1];
        },
        mount(elem, node = null) {
            elem.$el = node;
            this.checkAllMounted();
        },
        checkAllMounted() {
            if (!this.isMounted) {
                this.allMounted = false;
            }
            else {
                this.allMounted = !this.blocks.find(block => !block.$el) || !this.edges.find(edge => !edge.$el);
            }
        },
        updateBlockArguments(block, args, removedParams) {
            if (removedParams.length > 0) {
                this.parameterRemoved(block, removedParams);
            }
            this.$set(block, 'arguments', args);
            this.commit();
            if(removedParams.length > 0) {
                this.$nextTick(() => this.refreshEdges());
            }
        },
        updateBlockDescription(block, description) {
            this.$set(block, 'description', description);
            this.commit();
        },
        updateBlockPos(block, pos, saveHistory = true) {
            this.$set(block, 'position', pos);
            this.commit(null, saveHistory, false);
        },
        updateBlockResult(block, result) {
            this.$set(block, 'result', result);
            this.commit();
        },
        updateBlockSelected(block, selected, unselectOthers = true) {
            if (unselectOthers) {
                this.unselectAll();
            }
            this.$set(block, 'selected', selected);
            this.commit(null, false, false);
        },
        updateBlockSpec(block, data) {
            let parameterFields = ['name', 'schema', 'description', 'optional', 'deprecated', 'experimental', 'default'];
            let newBlock = Utils.omitFromObject(block.spec, parameterFields);
            Object.assign(newBlock, data);
            // Remove default values (and unset default value if parameter is required)
            if (!newBlock.optional) {
                delete newBlock.optional;
                delete newBlock.default;
            }
            if (!newBlock.deprecated) {
                delete newBlock.deprecated;
            }
            if (!newBlock.experimental) {
                delete newBlock.experimental;
            }
            this.$set(block, 'spec', newBlock);
            this.commit();
        },
        updateBlock(block, key, value, extra) {
            switch(key) {
                case 'arguments':
                    this.updateBlockArguments(block, value, extra);
                    break;
                case 'description':
                    this.updateBlockDescription(block, value);
                    break;
                case 'position':
                    this.updateBlockPos(block, value, extra);
                    break;
                case 'result':
                    this.setResultNode(block, value);
                    break;
                case 'selected':
                    this.updateBlockSelected(block, value, extra);
                    break;
                case 'spec':
                    this.updateBlockSpec(block, value);
                    break;
            }
        },
        updateHiddenParameterRefEdges() {
            // We can only reliably detect parameter refs if we know which parameters a process makes available to the child process
            // So if we don't have process schemas, don't offer this functionality.
            // Also don't execute (yet) if no parameters are given or not all elements are mounted yet.
            if (!this.hasProcesses || !this.allMounted || !this.blocks.find(block => block.type === 'parameter')) {
                this.hiddenParameterRefEdges = {};
                return;
            }

            let hiddenRefs = {};
            for(let process of this.processBlocks) {
                for (let argName in process.arguments) {
                    let value = process.arguments[argName];
                    if (!Utils.isObject(value) || !Utils.isObject(value.process_graph)) {
                        continue; // Process can only have hidden refs it it contains a process graph
                    }
                    
                    let refs = PgUtils.getRefs(value, true, true).filter(ref => typeof ref.from_parameter !== 'undefined');
                    for(let ref of refs) {
                        try {
                            if (process.$el.isParameterScoped(argName, ref.from_parameter)) {
                                continue; // Skip if the parameter usage is scoped (i.e. defined as process parameetr for the children)
                            }
                            let parameter = this.getPgParameterById('$' + ref.from_parameter);
                            if (!parameter) {
                                continue; // Skip if parameter can't be found
                            }
                            let parameter1 = parameter.$el.getBlockParameter('output');
                            let parameter2 = process.$el.getBlockParameter(argName);
                            let id = `${parameter.id}->${process.id}:${argName}`;
                            if (parameter1 && parameter2) {
                                if (this.hiddenParameterRefEdges[id]) {
                                    hiddenRefs[id] = this.hiddenParameterRefEdges[id];
                                }
                                else {
                                    hiddenRefs[id] = {
                                        $el: null,
                                        id,
                                        parameter1,
                                        parameter2
                                    };
                                }
                            }
                        } catch(error) {
                             console.warn(error);
                        }
                    }
                }

            }
            this.hiddenParameterRefEdges = hiddenRefs;
        },
        parameterRemoved(block, parameterNames) {
            for(let edge of this.edges.slice(0)) {
                if(edge.parameter2.$parent.id === block.id && parameterNames.includes(edge.parameter2.name)) {
                    this.removeEdge(edge);
                }
            }
        },
        startDragBlock(event) {
            for(let block of this.blocks) {
                if (block.$el) {
                    block.$el.startDrag(event);
                }
            }
        },
        refreshEdges() {
            this.refreshEdgesFor(this.edges);
            this.refreshEdgesFor(Object.values(this.hiddenParameterRefEdges));
        },
        refreshEdgesFor(edges) {
            for(let edge of edges) {
                if (edge.$el) {
                    edge.$el.updatePositions();
                }
            }
        },
        supports(event) {
            return Boolean(this.$listeners && this.$listeners[event]);
        },
        focus() {
            this.$refs.div.focus();
        },
        link(parameter) {
            if (this.state.linkFrom) {
                this.state.linkTo = parameter;
            }
            else {
                this.state.linkFrom = parameter;
            }
        },
        unlink(parameter = null) {
            if (parameter) {
                if (this.state.linkTo == parameter) {
                    this.state.linkTo = null;
                }
                else if (this.state.linkFrom == parameter) {
                    this.state.linkFrom = null;
                    this.linkingLine = null;
                }
            }
            else {
                this.state.linkTo = null;
                this.state.linkFrom = null;
                this.linkingLine = null;
            }
        },
        multiSelect() {
            let box = this.selectRect;
            this.blocks
                .filter(b => {
                    if (Array.isArray(b.position) && b.$el) {
                        let pos = b.$el.getDimensions();
                        return boxIntersectsBox(box.x, box.y, box.width, box.height, pos.x, pos.y, pos.width, pos.height);
                    }
                    return false;
                })
                .map(b => b.selected = true);
            this.edges
                .filter(e => Array.isArray(e.position1) && Array.isArray(e.position2) && boxIntersectsLine(box.x, box.y, box.width, box.height, e.position1[0], e.position1[1], e.position2[0], e.position2[1]))
                .map(e => e.selected = true);
        },
        toJSON() {
            let process = this.export();
            return JSON.stringify(process, null, 2);
        },
        async onDocumentMouseUp(event) {
            if (this.parameterViewer) {
                return;
            }
            if (this.selectedSideEdge) {
                this.selectEdge(this.selectedSideEdge, null); // Reset selectedParameter, but don't change selected state.
            }
            if (this.state.selecting) {
                this.multiSelect();
                this.state.selecting = null;
            }
            if (this.state.moving) {
                this.state.moving = null;
            }
            if (this.state.editable && this.state.linkFrom) {
                if (event.which == 1 && this.state.linkTo) {
                    try {
                        await this.addEdge(this.state.linkFrom, this.state.linkTo);
                    } catch (error) {
                        this.$emit("error", error);
                    }
                }
                this.unlink();
            }
        },
        async onKeyDown(event) {
            if (this.parameterViewer) {
                return;
            }
            var allInputs = document.querySelectorAll('input, textarea, button, select, datalist');
            for(let el of allInputs) {
                if (el === document.activeElement) {
                    return;
                }
            }

            let captured = false;
            if (this.state.editable) {
                // delete selected blocks/edges
                if (event.code === 'Delete') {
                    this.deleteSelected();
                    captured = true;
                }
                else if (event.ctrlKey || event.metaKey) { // STRG for Win/Linux, meta/cmd from Mac
                    if (event.code === 'KeyV') {
                        if (this.hasSelection && this.clipboard) {
                            return; // ToDo: Implement pasting for selected blocks
                        }
                        else {
                            try {
                                const text = await navigator.clipboard.readText();
                                let process = JSON.parse(text);
                                await this.import(process);
                            } catch(error) {
                                this.$emit('error', error, 'Paste Error');
                            }
                        }
                        captured = true;
                    }
                    else if (event.code === 'KeyC') {
                        if (this.hasSelection) {
                            this.clipboard = {
                                blocks: this.selectedBlocks.slice(0),
                                edges: this.selectedEdges.slice(0)
                            };
                        }
                        else {
                            try {
                                let json = this.toJSON();
                                await navigator.clipboard.writeText(json);
                                captured = true;
                            } catch(error) {
                                this.$emit('error', error, 'Copy Error');
                            }
                        }
                        captured = true;
                    }
                }
            }

            if (captured) {
                event.preventDefault();
                event.stopPropagation();
            }
        },
        onMouseWheel(event) {
            if (this.parameterViewer) {
                return;
            }
            if (!this.explicitZoom || this.hasFocus || event.ctrlKey || event.metaKey) { // STRG for Win/Linux, meta/cmd for Mac
                let mouse = this.getMousePos(event);
                var dX = mouse[0] - this.state.center[0];
                var dY = mouse[1] - this.state.center[1];
                var deltaScale = Math.pow(1.1, Math.sign(event.deltaY)*-1);
                this.moveCenter(-dX*(deltaScale-1), -dY*(deltaScale-1));
                this.state.scale *= deltaScale;
                event.preventDefault();
                this.showZoomInfo = false;
            }
        },
        getMousePos(event) {
            let root = this.$refs.div.getBoundingClientRect();
            return [
                event.clientX - root.left,
                event.clientY - root.top
            ];
        },
        onMouseMove(event) {
            if (this.parameterViewer) {
                return;
            }
            try {
                let mousePos = this.getMousePos(event);

                if (this.state.editable && this.selectedSideEdge) {
                    var origin = this.selectedSideEdge.selectedParameter.getCirclePosition();
                    if (origin) {
                        var distance = Math.sqrt(Math.pow(mousePos[0]-origin[0], 2)+Math.pow(mousePos[1]-origin[1], 2));
                        if (distance > 10) {
                            this.link(this.selectedSideEdge.selectedParameter);
                            this.removeEdge(this.selectedSideEdge);
                            this.commit();
                        }
                    }
                }

                if (this.state.selecting) {
                    this.state.selecting.current = mousePos;
                }

                if (this.state.moving) {
                    this.moveCenter((mousePos[0]-this.state.moving[0]), (mousePos[1]-this.state.moving[1]));
                    this.state.moving = mousePos;
                }

                if (this.state.linkFrom) {
                    var position = this.state.linkFrom.getCirclePosition();
                    if (position) {
                        this.linkingLine = {
                            x1: position[0],
                            y1: position[1],
                            x2: mousePos[0],
                            y2: mousePos[1],
                            'stroke': 'rgba(0,0,0,0.4)',
                            'stroke-width': 3 * this.state.scale
                        };
                    }
                }
            } catch (error) {
                this.$emit("error", error);
            }
        },
        onMouseDown(event) {
            if (this.parameterViewer) {
                return;
            }
            let sideSelected = null;
            let mousePos = this.getMousePos(event);

            if (event.which == 1) {
                if (event.shiftKey) {
                    // Start multi select via box
                    this.state.selecting = {
                        start: mousePos,
                        current: mousePos
                    }
                }
                else {
                    // No multiselect: unselect all
                    this.unselectAll();
                }

                // Select edges
                for (var edge of this.edges) {
                    if (!edge.$el) {
                        continue;
                    }
                    var collide = edge.$el.collide(mousePos[0], mousePos[1]);
                    if (collide != false) {
                        if (this.selectedEdges.length === 0 && !event.shiftKey) {
                            if (collide < 0.3) {
                                sideSelected = edge.parameter2;
                            }
                            else if (collide > 0.7) {
                                sideSelected = edge.parameter1;
                            }
                        }
                        this.selectEdge(edge, true, sideSelected);
                        if (edge.issues.length > 0) {
                            for(let issue of edge.issues) {
                                this.$emit('error', issue);
                            }
                        }
                        event.preventDefault();
                        break;
                    }
                }
            }

            if (event.which == 2 || (event.which == 1 && !sideSelected && !event.shiftKey)) {
                this.state.moving = mousePos;
            }

            this.focus();
        },

        getDimensions() {
            return Utils.domBoundingBox(this.$refs.div);
        },

        async clear() {
            return await this.startTransaction(async () => {
                this.edges = [];
                // Don't remove parameters injected by props (fixed callback parameters)
                this.blocks = this.blocks.filter(b => b.type === 'parameter' && Utils.isObject(b.spec) && b.origin === 'schema');
                this.nextBlockId = 1;
                this.nextEdgeId = 1;
                this.process = {};
                this.updateHiddenParameterRefEdges();
                return true;
            });
        },

        commit(data = null, history = true, propagate = true) {
            // Don't commit when in a transaction
            if (this.activeTransactions > 0) {
                return;
            }

            if (history !== false) {
                this.saveHistory();
            }
            if (propagate !== false) {
                this.$emit('input', data === null ? this.export() : data);
                this.updateHiddenParameterRefEdges();
            }
            else {
                this.refreshEdges();
            }
        },
    
        /**
         * Save the current situation to the history
         */
        saveHistory() {
            var data = this.export(true);
            this.history.splice(this.historyPointer + 1, this.historySize, data);
            if (this.history.length > this.historySize) {
                this.history.shift();
            }
            this.historyPointer = this.history.length - 1;
            this.$emit('historyChanged', this.history, this.historyPointer);
        },
        async undo() {
            await this.historyStep(-1);
        },
        async redo() {
            await this.historyStep(1);
        },
        async historyStep(step) {
            var index = this.historyPointer + step;
            var element = this.history[index];
            if (element) {
                this.historyPointer = index;
                this.import(element, { saveHistory: false, undoOnError: false, perfectScale: false });
                this.$emit('historyChanged', this.history, this.historyPointer);
            }
        },

        setResultNode(block, result = true) {
            block = this.getBlockById(block.id);
            if (!block || block.result === result) {
                return; // Nothing to change
            }

            this.updateBlockResult(block, result);
            var foundNewResultNode = false;
            var hasOtherBlocks = false;
            for(var other of this.processBlocks) {
                if (block && other.id === block.id) {
                    continue;
                }
                
                hasOtherBlocks = true;
                // If we set a new result node, ensure that only that node is a result node and no other.
                if (result) {
                    this.updateBlockResult(other, false);
                }
                // Find a potential result node if we don't want this to be the result node
                else {
                    if (other.$el && !other.$el.hasOutputEdges()) {
                        this.updateBlockResult(other, true);
                        foundNewResultNode = true;
                        break;
                    }
                }
            }
            // If we have no new potential result node, communicate to the user.
            if (hasOtherBlocks && !result && !foundNewResultNode) {
                this.$emit("error", "No result node available, please specify one.");
            }
        },

        getPositionForPageXY(x, y) {
            var rect = this.getDimensions();
            if (x !== null) {
                x = (x - rect.offsetLeft - this.state.center[0]) / this.state.scale;
            }
            if (y !== null) {
                y = (y - rect.offsetTop - this.state.center[1]) / this.state.scale;
            }
            return [x, y];
        },

        addProcess(process_id, args = {}, position = [], namespace = null) {
            return this.addBlock({
                process_id,
                namespace,
                arguments: args,
                position
            });
        },

        addBlock(node, id = null) {
            id = '#' + String(this.incrementId(id));
            if (typeof node.toJSON === 'function') {
                node = node.toJSON();
            }
            var block = {
                id,
                type: 'process',
                selected: false,
                position: node.position,
                process_id: node.process_id,
                namespace: node.namespace,
                arguments: node.arguments,
                description: node.description || null,
                result: node.result || false
            };
            if (this.processRegistry) {
                block.spec = this.processRegistry.get(node.process_id, node.namespace);
            }

            var size = this.getBlockSize(block);
            block.position = Utils.ensurePoint(block.position, () => this.getNewBlockDefaultPosition(size));

            // If there's already a result node, remove the flag here
            if (block.result && this.blocks.filter(b => b.result === true).length) {
                delete block.result;
            }
            // Make this the result node if there's no node yet
            else if (this.processBlocks.length === 0) {
                block.result = true;
            }
            
            this.blocks.push(Vue.observable(block));
            this.commit();
            return block;
        },

        getNewBlockDefaultPosition(blockSize) {
            var rect = this.getDimensions();
            var position = [
                (-this.state.center[0] + rect.width/2)/this.state.scale - blockSize[0]/2 + this.newBlockOffset,
                (-this.state.center[1] + rect.height/2)/this.state.scale - blockSize[1]/2 + this.newBlockOffset
            ];
            if (this.newBlockOffset < 150) {
                this.newBlockOffset += 10;
            }
            return position;
        },

        getBlockSize(block) {
            if (block.$el) {
                let dim = block.$el.getDimensions();
                return [dim.width / this.state.scale, dim.height / this.state.scale];
            }

            let inputs = Math.max(
                Utils.size(block.arguments),
                Utils.isObject(block.spec) ? Utils.size(block.spec.parameters) : 0
            );

            let size = Config.blockWidth;
            let width;
            if (inputs > 0) {
                width = this.state.compactMode ? size.compactParams : size.normalParams;
            }
            else {
                width = this.state.compactMode ? size.compact : size.normal;
            }

            let commentHeight = typeof block.description === 'string' ? 40 : 0;
            let height = MARGIN + inputs * 15 + commentHeight;

            return [width, height];
        },

        moveCenter(dX, dY, reset = false) {
            var rect = this.getDimensions();
            this.state.center = [
                (reset ? rect.width/2 : this.state.center[0]) + dX,
                (reset ? rect.height/2 : this.state.center[1]) + dY
            ];
            this.newBlockOffset = 0;
        },

        unselectAll() {
            for(var block of this.blocks) {
                this.updateBlockSelected(block, false, false);
            }
            for(var edge of this.edges) {
                this.selectEdge(edge, false);
            }
        },

        selectEdge(edge, select = true, parameter = null) {
            if (!Utils.isObject(edge)) {
                edge = this.edges[edge];
            }
            if (edge.selected === select) {
                return false; // Nothing to change
            }
            if (select !== null) {
                this.$set(edge, "selected", select);
            }
            this.$set(edge, "selectedParameter", parameter);
            return true;
        },

        /**
         * Edge to remove
         */
        removeEdge(edge) {
            edge.parameter1.eraseEdge(edge);
            edge.parameter2.eraseEdge(edge);
            this.$delete(this.edges, this.edges.indexOf(edge));
        },
            
        /**
         * Remove a block
         */
        async removeBlock(block) {
            // Check if the parameter for this block is used in child processes (callbacks).
            // Then don't delete, but give error instead.
            if (block.type === 'parameter') {
                let param = null;
                let conflictBlock = this.blocks.find(otherBlock => {
                    param = otherBlock.$el.hiddenParameterRef(block);
                    return (param !== null);
                });
                if (conflictBlock) {
                    throw new Error(`Parameter is still used in '${conflictBlock.id}', parameter '${param}'. Only unused parameters can be deleted.`);
                }
            }

            // now start deleting the block
            return await this.startTransaction(async () => {
                var i = this.blocks.findIndex(b => b.id == block.id);
                if (i < 0) {
                    return false;
                }

                for (var edge of this.edges.slice(0)) {
                    if (edge.parameter1.$parent.id === block.id || edge.parameter2.$parent.id === block.id) {
                        this.removeEdge(edge);
                    }
                }

                if (block.result) {
                    this.setResultNode(block, false);
                }

                this.$delete(this.blocks, i);
                return true;
            });
        },

        /**
         * Retreive a block by ID
         */
        getBlockById(blockId) {
            var blocks = this.blocks.filter(block => block.id === blockId);
            if (blocks.length > 0) {
                return blocks[0];
            }
            return null;
        },

        /**
         * Delete the current link
         */
        async deleteSelected() {
            if (!this.hasSelection) {
                return false;
            }

            return await this.startTransaction(async () => {
                // Remove the selected blocks and its edges
                for(var block of this.selectedBlocks.slice(0)) { // copy to avoid race condition
                    if (block.$el.allowsDelete) {
                        await this.removeBlock(block);
                    }
                }

                // Removes the selected edges
                for(var edge of this.selectedEdges.slice(0)) { // copy to avoid race condition
                    this.removeEdge(edge);
                }
                return true;
            });
        },

        async addEdgeByNames(b1, p1, b2, p2) {
            var blocks = [];
            for(var id of [b1, b2]) {
                var block = this.getBlockById(id);
                if (!block) {
                    throw "Can't find block: " + id;
                }
                else if (!block.$el) {
                    throw "Block not mounted yet: " + id;
                }
                blocks.push(block.$el);
            }
            await this.addEdge(
                blocks[0].getBlockParameter(p1),
                blocks[1].getBlockParameter(p2)
            );
        },
 
        async addEdge(p1, p2) {
            if (!p1 || !p2) {
                throw 'One of the parameters is invalid.';
            }
            // Check whether you want to connect the same parameters
            if (p1 == p2) {
                return; // Probably by mistake, don't show an error to not annoy people
            }
            // Check whether you want to connect the block to itself
            if (p1.$parent == p2.$parent) {
                throw 'You can\'t link a block to itself';
            }

            var id = this.nextEdgeId++;
            var edge = {id, selected: false, inactive: false, issues: [], $el: null};
            if (p1.output) {
                edge.parameter1 = p1;
                edge.parameter2 = p2;
            }
            else {
                // Reverse the order of in and out
                edge.parameter1 = p2;
                edge.parameter2 = p1;
            }

            // You have to link an input with an output
            if (edge.parameter1.output === edge.parameter2.output) {
                throw 'You have to link an input with an output';
            }
            // Check for non-recursiveness
            if (this.allSuccessors(edge.parameter1).indexOf(edge.parameter2.id) !== -1) {
                throw 'You can not create a loop';
            }
            // Check whether the data type allows multiple input edges
            if (edge.parameter2.getEdgeCount() > 0 && !edge.parameter2.allowsMultipleInputs) {
                throw 'Parameter accepts only one input';
            }

            // Check whether the edge exists
            for (var other of this.edges) {
                if (other.$el && other.$el.equals(edge)) {
                    throw 'This connection exists already';
                }
            }

            // Check type compatibility
            if (!JsonSchemaValidator.isSchemaCompatible(edge.parameter2.schema || {}, edge.parameter1.schema || {}, false, true)) {
                let issue = 'Incoming data type is not compatible for parameter "' + edge.parameter2.name + '"';
                edge.issues.push(issue);
                this.$emit('error', issue);
            }

            return await this.startTransaction(async () => {
                this.unlink();

                // Create edge
                this.edges.push(Vue.observable(edge));
                edge.parameter1.addEdge(edge);
                edge.parameter2.addEdge(edge);

                // Update result node
                this.setResultNode(edge.parameter1.$parent, false);
                return true;
            });
        },

        /**
         * Find all successors of a block, and their successors
         */
        allSuccessors(outputParameter) {
            var block = outputParameter.$parent;
            // Blocks already explored
            var explored = {};
            var exploreList = [block];
            explored[block.id] = true;
        
            while (exploreList.length > 0) {
                var currentBlock = exploreList.pop();
                for (var key in currentBlock.edges) {
                    for (var i in currentBlock.edges[key]) {
                        var edge = currentBlock.edges[key][i];
                        if (edge.block1 == currentBlock) {
                            var target = edge.block2;
                            if (!(target.id in explored)) {
                                explored[target.id] = true;
                                exploreList.push(target);
                            }
                        }
                    }
                }
            }

            return Object.values(explored);
        },

        /**
         * Changing the compact mode
         */
        async toggleCompact() {
            this.state.compactMode = !this.state.compactMode;
            this.$emit('compactMode', this.state.compactMode);
            await this.$nextTick();
            this.refreshEdges();
        },

        export(internal = false) {
            let data = {
                process_graph: {}
            };

            for(let block of this.processBlocks) {
                let keys = ['process_id', 'namespace', 'arguments', 'description', 'result'];
                if (internal) {
                    // Keep internal state for history
                    keys.push('position');
                }
                let copy = Utils.pickFromObject(block, keys);
                // Remove default values for simplicity
                if (copy.description === null) {
                    delete copy.description;
                }
                if (copy.result !== true) {
                    delete copy.result;
                }
                if (!copy.namespace) {
                    delete copy.namespace;
                }
                let nodeId = block.id.substr(1);
                data.process_graph[nodeId] = copy;
            }

            if (!this.parent) {
                data.parameters = [];
                let parameterBlocks = this.getPgParameters();
                for(let param of parameterBlocks) {
                    data.parameters.push(param.spec);
                }
            }

            // ToDo: Currently, we just use the id, categories, result value etc from the original process.
            // Implement to allow custom settings from users.
            return new BlocksProcess(Object.assign({}, this.process, data));
        },

        // Options may contain:
        // - undoOnError: don't undo changes when an error occured (default: true)
        // - saveHistory: commit the changes to the history (default: true)
        // - propagate: emit the changes to the parent v-model (default: true)
        async startTransaction(fn, options = {}, ...args) {
            let success;
            this.activeTransactions++;

            try {
                success = await fn(args);
            } catch (error) {
                // If an error occured: show it and restore the last working state from history.
                this.$emit('error', error, "Model is invalid");
                if (options.undoOnError !== false) {
                    try {
                        await this.undo();
                    } catch (error2) {
                        this.$emit('error', error, "Revert failed");
                    }
                }
                success = false;
            }

            this.activeTransactions--;
            this.commit(null, options.saveHistory, options.propagate);

            return success;
        },

        // Options may contain:
        // - all from startTransaction()
        // - clear: Clear the model builder before import (default: true)
        // - perfectScale: Apply perfect scale after import (default: true)
        async import(process, options = {}) {
            return await this.startTransaction(async () => {
                // clear screen...
                if (options.clear !== false) {
                    await this.clear();
                    this.process = process instanceof ProcessGraph ? process.toJSON() : process;
                }

                if (!Utils.isObject(process)) {
                    return false;
                }

                // Parse process
                if (process instanceof ProcessGraph) {
                    // Make a copy
                    this.processGraph = new ProcessGraph(process.toJSON(), this.processRegistry);
                    this.processGraph.setParent(process.parentProcessId, process.parentParameterName);
                }
                else {
                    this.processGraph = new ProcessGraph(process, this.processRegistry);
                }
                this.processGraph.allowEmpty();
                this.processGraph.parse();

                await this.importPgParameters(this.processGraph.getProcessParameters(true), 'user', options.clear !== false);
                await this.importNodes(this.processGraph.getStartNodes());
                await this.importEdges(this.processGraph);

                if (options.perfectScale !== false) {
                    this.perfectScale();
                }

                this.$nextTick(() => this.updateHiddenParameterRefEdges());

                return true;
            }, options);
        },

        async importPgParameters(params, origin, clear = true) {
            if (!Array.isArray(params)) {
                return;
            }

            let options = {
                undoOnError: false,
                saveHistory: false,
                propagate: false
            };
            return await this.startTransaction(async () => {
                // Remove existing parameters from the given origin
                if (clear) {
                    this.blocks = this.blocks.filter(b => b.type !== 'parameter' || b.origin !== origin);
                }

                let size = this.getBlockSize({}); // Estimate base size for an empty block
                let position = [0,0];
                for(var i in params) {
                    position = [
                        -size[0] - MARGIN,
                        i * (size[1] + MARGIN)
                    ];

                    await this.addPgParameter(params[i], origin, position);
                }
            }, options);
        },

        async addPgParameter(param, origin = 'user', position = null) {
            return await this.startTransaction(async () => {
                let id = '$' + param.name;
                // Check a parameter with the same name exists
                if (this.blocks.findIndex(p => p.type === 'parameter' && p.id == id) >= 0) {
                    return false;
                }
                param = Utils.deepClone(param);
                if (typeof param.schema === 'undefined') {
                    param.schema = {};
                }
                this.blocks.push(Vue.observable({
                    id,
                    type: 'parameter',
                    origin,
                    position: Utils.ensurePoint(position, () => this.getNewBlockDefaultPosition(this.getBlockSize({}))),
                    spec: param
                }));
                return true;
            });
        },

        getPgParameters() {
            return this.blocks.filter(b => b.type === 'parameter');
        },

        getPgParameterById(id) {
            return this.blocks.find(b => b.type === 'parameter' && b.id === id);
        },

        async importEdges(pg) {
            var nodes = pg.getNodes();
            for(var node of Object.values(nodes)) {
                var args = node.getArgumentNames();
                for(let i in args) {
                    var val = node.getRawArgument(args[i]);
                    switch(node.getArgumentType(args[i])) {
                        case 'result':
                            await this.addEdgeByNames('#' + pg.getNode(val.from_node).id, "output", '#' + node.id, args[i], false);
                            break;
                        case 'parameter':
                            await this.addEdgeByNames('$' + val.from_parameter, "output", '#' + node.id, args[i], false);
                            break;
                        case 'object':
                        case 'array':
                            await this.importEdgeDeep(val, pg, node, args, i);
                            break;
                    }
                }
            }
        },

        async importEdgeDeep(val, pg, node, args, i) {
            for(let k in val) {
                // k !== 'process_graph' prevents importing sub process graphs like in load_collection, see #118
                if(val[k] && typeof val[k] === "object" && k !== 'process_graph') {
                    await this.importEdgeDeep(val[k], pg, node, args, i);
                }
                else if (!Utils.isRef(val)) {
                    continue;
                }
                else if (val.from_node) {
                    await this.addEdgeByNames('#' + pg.getNode(val.from_node).id, "output", '#' + node.id, args[i], false);
                }
                else if (val.from_parameter) {
                    await this.addEdgeByNames('$' + val.from_parameter, "output", '#' + node.id, args[i], false);
                }
            }
        },

        async importNodes(nodes, x = 0, y = 0, imported = []) {
            let nextNodes = [];
            let maxX = 0;
            for(let node of nodes) {
                // `node` is a Node class instance as defined by the js-processgraphs library
                // `data` is the simple object that is defined by JSON process graphs
                // `block` is the representation used by the Block component to render the block

                // To get a better layout, only add the block once all previous nodes are added
                if (imported.includes(node.id) || node.getPreviousNodes().find(prev => !imported.includes(prev.id)) !== undefined) {
                    y += MARGIN / 2; // add a small offset so that lines going through a box are easier to see
                    continue;
                }

                let data = typeof node.toJSON === 'function' ? node.toJSON() : node;
                data.position = Utils.ensurePoint(data.position, () => [x,y]);

                let block = this.addBlock(data, node.id);
                imported.push(node.id);

                let size = this.getBlockSize(block);
                maxX = Math.max(maxX, data.position[0] + size[0]);
                y = data.position[1] + size[1] + MARGIN;

                nextNodes = nextNodes.concat(node.getNextNodes());
            }
            if (nextNodes.length) {
                await this.importNodes(nextNodes, maxX + MARGIN, 0, imported);
            }
        },

        incrementId(id = null) {
            if (typeof id !== 'number' && (typeof id !== 'string' || id.length === 0)) {
                id = this.nextBlockId;
                this.nextBlockId++;
            }
            let int = Number.parseInt(id);
            if (!Number.isNaN(int)) {
                this.nextBlockId = Math.max(this.nextBlockId, int+1);
            }
            return id;
        },

        /**
         * Go to the perfect scale
         */
        perfectScale() {
            if (!this.$refs.div || this.blocks.length === 0) {
                return;
            }

            var xMin = null, xMax = null;
            var yMin = null, yMax = null;

            for (let block of this.blocks) {
                let size = this.getBlockSize(block);
                let pos = Utils.ensurePoint(block.position);
                if (xMin == null) {
                    xMin = pos[0]-15
                    xMax = pos[0]+size[0]+15;
                    yMin = pos[1]-15
                    yMax = pos[1]+size[1]+15;
                } else {
                    xMin = Math.min(xMin, pos[0]-15);
                    xMax = Math.max(xMax, pos[0]+size[0]+15);
                    yMin = Math.min(yMin, pos[1]-15);
                    yMax = Math.max(yMax, pos[1]+size[1]+15);
                }
            }

            var rect = this.$refs.div.getBoundingClientRect();
            var scaleA = rect.width/(xMax-xMin);
            var scaleB = rect.height/(yMax-yMin);
            this.state.scale = Math.min(scaleA, scaleB, 1.5); // Don't scale higher than 1.5
            this.state.center = [
                rect.width/2 - this.state.scale*(xMin+xMax)/2.0,
                rect.height/2 - this.state.scale*(yMin+yMax)/2.0
            ];
            this.newBlockOffset = 0;
        },

        showParameterViewer(parameters, values, title, isEditable, selectParameterName, saveCallback, parent) {
            this.parameterViewer = {
                parameters,
                values,
                title,
                selectParameterName,
                parent
            };
        }
    }
};

class BlocksProcess {
    constructor(process) {
        Object.assign(this, process);
    }
}
</script>

<style lang="scss">
.vue-component.model-builder {
	width: 100%;
	height: 100%;
	position: relative;

    &.editable.focus .blocks {
        border-color: rgba(22, 102, 182, 0.3);
    }

    &:focus,
    .blocks:focus,
    .canvas:focus {
        outline: 0;
    }
    
    .canvas {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 1;
    }
    
    .blocks {
        box-sizing: border-box;
        border: 1px solid transparent;
        overflow: hidden;
        position: absolute;
        z-index: 3;
        width: 100%;
        height: 100%;
    }

    &.compact .blockicon .delete,
    &.compact .blockicon .info,
    &.compact .blockicon .addDescription,
    &.compact .blockId,
    &.compact .editDescription, 
    &.scale_xs .blockicon,
    &.scale_s .blockicon,
    &.scale_xs .connector .text {
        display: none;
    }
    .zoomInfo {
        position: absolute;
        top: 0;
        right: 0;
        display: inline-block;
        padding: 0.3em;
        background-color: #f9f9f9;
        border-radius: 0 0 0 0.3em;
        z-index: 5;
    }
    &.scale_xs .editDescription {
        visibility: hidden;
    }
}
</style>