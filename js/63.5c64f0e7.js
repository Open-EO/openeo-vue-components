"use strict";(self["webpackChunk_openeo_vue_components"]=self["webpackChunk_openeo_vue_components"]||[]).push([[63],{63:(e,t,a)=>{a.r(t),a.d(t,{default:()=>h});var n=function(){var e=this,t=e._self._c;return t("div",{staticClass:"vue-component search-box",class:{compact:e.compact}},[t("span",{staticClass:"icon"},[e._v("🔎")]),t("input",{directives:[{name:"model",rawName:"v-model",value:e.searchTerm,expression:"searchTerm"}],attrs:{type:"search",placeholder:e.placeholder,minlength:e.minLength,title:e.searchHint},domProps:{value:e.searchTerm},on:{input:function(t){t.target.composing||(e.searchTerm=t.target.value)}}})])},r=[];const s={name:"SearchBox",props:{value:{type:String,default:""},placeholder:{type:String,default:"Search"},minLength:{type:Number,default:1},compact:{type:Boolean,default:!1}},data(){return{searchTerm:this.value}},watch:{searchTerm(e,t){e.length<this.minLength&&(e=""),this.$emit("input",e)}},computed:{searchHint(){return this.minLength>1?`Searching requires at least ${this.minLength} characters.`:null}}},c=s;var l=a(1656),o=(0,l.A)(c,n,r,!1,null,null,null);const h=o.exports}}]);
//# sourceMappingURL=63.5c64f0e7.js.map