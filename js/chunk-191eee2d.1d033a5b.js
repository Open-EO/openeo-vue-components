(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-191eee2d"],{c288:function(e,t,a){"use strict";a("c8f4")},c8f4:function(e,t,a){},daf9:function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"vue-component parameter-viewer"},[a("header",[a("h2",[e._v(e._s(e.title))]),a("button",{staticClass:"close",on:{click:function(t){return e.$emit("close")}}},[e._v("Close")])]),0===e.data.length?a("p",[e._v("No parameters available.")]):e._l(e.data,(function(t){return a("section",{key:t.name,class:t.classes},[a("h3",[e._v(e._s(t.name))]),t.isObject&&t.value.from_node?a("div",{staticClass:"externalData fromNode"},[a("em",[e._v("Output of "),a("tt",[e._v("#"+e._s(t.value.from_node))])],1)]):t.isObject&&t.value.from_parameter?a("div",{staticClass:"externalData fromArgument"},[a("em",[e._v("Value of process parameter "),a("tt",[e._v("#"+e._s(t.value.from_parameter))])],1)]):t.isObject&&t.value.process_graph?a("ModelBuilder",{attrs:{id:t.name,value:t.value,parent:e.parent,explicitZoom:!0}}):a("ObjectTree",{attrs:{data:t.value}}),t.description?a("div",{staticClass:"description"},[a("i",{staticClass:"fas fa-info-circle"}),a("Description",{attrs:{description:t.description,compact:!0}})],1):e._e()],1)}))],2)},r=[],l=a("1b23"),o={name:"ParameterViewer",components:{Description:()=>Promise.resolve().then(a.bind(null,"30a3")),ObjectTree:()=>Promise.resolve().then(a.bind(null,"a125"))},props:{title:{type:String,default:"Parameters"},parameters:{type:Array,default:()=>[]},values:{type:Object,default:()=>({})},selectParameterName:{type:String,default:null},parent:{type:Object,default:null}},computed:{data(){return this.parameters.map(e=>{let t=this.values[e.name];return{name:e.name,classes:{highlight:e.name===this.selectParameterName},description:e.description,value:t,isObject:l["a"].isObject(t)}})}},beforeCreate(){this.$options.components.ModelBuilder=a("8f7d").default},mounted(){if(this.selectParameterName){let e=this.$el.querySelector("section.highlight");if(e){let t=Math.max(document.documentElement.scrollTop,document.body.scrollTop),a=Math.max(document.documentElement.scrollTop,document.body.scrollTop);e.scrollIntoView(),document.documentElement.scrollTop=document.body.scrollTop=t,document.documentElement.scrollLeft=document.body.scrollLeft=a}}}},n=o,c=(a("c288"),a("2877")),i=Object(c["a"])(n,s,r,!1,null,null,null);t["default"]=i.exports}}]);
//# sourceMappingURL=chunk-191eee2d.1d033a5b.js.map