"use strict";(self["webpackChunk_openeo_vue_components"]=self["webpackChunk_openeo_vue_components"]||[]).push([[962],{9962:(e,t,s)=>{s.r(t),s.d(t,{default:()=>f});var r=function(){var e=this,t=e._self._c;return t("section",{staticClass:"vue-component stac stac-fields metadata"},[e._l(e.fields,(function(s){return[t(e.headingTag,{key:s.extension,tag:"component",domProps:{innerHTML:e._s(s.label||"General")}}),t("section",{key:`section_${s.extension}`,staticClass:"group"},e._l(s.properties,(function(r,n){return t("div",{key:s.extension+n,staticClass:"tabular",class:{wrap:Boolean(r.custom||r.items)},attrs:{id:"field_"+n}},[t("label",{attrs:{title:n},domProps:{innerHTML:e._s(r.label)}}),t("div",{staticClass:"value"},[e._t(n,(function(){return[r.items?t("table",{staticClass:"table"},[t("thead",[t("tr",[Array.isArray(r.formatted)?e._e():t("th",[e._v(" ")]),e._l(r.itemOrder,(function(s){return t("th",{key:s,domProps:{innerHTML:e._s(r.items[s].label)}})}))],2)]),t("tbody",e._l(r.formatted,(function(s,n){return t("tr",{key:n},[Array.isArray(r.formatted)?e._e():t("th",[e._v(e._s(n))]),e._l(r.itemOrder,(function(r){return t("td",{key:`${r}_${n}`},[Array.isArray(s[r])?t("ol",{staticClass:"array"},e._l(s[r],(function(s,r){return t("li",{key:r},[t("span",{domProps:{innerHTML:e._s(s)}})])})),0):s[r]&&"object"===typeof s[r]?t("ul",{staticClass:"object"},e._l(s[r],(function(s,r){return t("li",{key:r},[t("strong",[e._v(e._s(e._f("key")(r)))]),e._v(": "),t("span",{domProps:{innerHTML:e._s(s)}})])})),0):t("div",{domProps:{innerHTML:e._s(s[r])}})])}))],2)})),0)]):"card4l:processing_chain"===n?t("Process",{staticClass:"inline",attrs:{process:r.value,provideDownload:!1,showGraph:!0}}):r.formatted?t("div",{staticClass:"formatted",domProps:{innerHTML:e._s(r.formatted)}}):[e._v(e._s(r.value))]]}),{prop:r,field:n})],2)])})),0)]}))],2)},n=[],i=s(735),a=s.n(i),o=s(8645),l=s(2400);const c=["stac_version","stac_extensions","id","type","title","description","keywords","providers","license","extent","summaries","links","assets","item_assets","conformsTo","deprecated","cube:dimensions"];a().Registry.externalRenderer=!0;const d={name:"StacFields",components:{Process:()=>Promise.resolve().then(s.bind(s,8844)),ObjectTree:l["default"]},props:{metadata:{type:Object,default:()=>({})},headingTag:{type:String,default:"h3"},ignore:{type:Array,default:()=>[]},type:{type:String,required:!0},context:{type:Object,default:()=>({})}},filters:{key:o.A.prettifyString},computed:{ignoreFn(){return this.ignore.length>0?e=>!this.ignore.includes(e):null},fields(){if("Collection"===this.type){let e=o.A.deepClone(this.metadata);o.A.isObject(e.summaries)||(e.summaries={});for(let t in e)c.includes(t)||(e.summaries[t]=[e[t]]);return a().formatSummaries(e,this.ignoreFn)}if("Item"===this.type)return a().formatItemProperties(this.metadata,this.ignoreFn);if("Asset"===this.type)return a().formatAsset(this.metadata,this.context,this.ignoreFn);throw new Error("Not implemented yet")}},methods:{label(e,t={}){return a().label(e,t)}}},u=d;var m=s(1656),p=(0,m.A)(u,r,n,!1,null,null,null);const f=p.exports}}]);
//# sourceMappingURL=962.1d28fc34.js.map