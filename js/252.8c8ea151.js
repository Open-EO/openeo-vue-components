"use strict";(self["webpackChunk_openeo_vue_components"]=self["webpackChunk_openeo_vue_components"]||[]).push([[252],{9252:(e,t,s)=>{s.r(t),s.d(t,{default:()=>u});var i=function(){var e=this,t=e._self._c;return e.unsupported.length>0?t("section",{staticClass:"vue-component message-block federation federation-backends"},[t("strong",{staticClass:"header"},[e._v("Federation")]),t("p",[e._v("This "+e._s(e.entity)+" is only available through the following services in the federation:")]),t("ul",e._l(e.services,(function(s){return t("li",{key:s.url},[t("div",{staticClass:"fed-header"},[t("strong",{staticClass:"fed-title"},[e._v(e._s(s.title))]),t("ul",{staticClass:"badges small inline"},["offline"===s.status?t("li",{staticClass:"badge red"},[e._v("offline")]):t("li",{staticClass:"badge green"},[e._v("online")])])])])})),0)]):e._e()},n=[],a=s(1612),r=s(1680);const l={name:"FederationNotice",mixins:[a.c],props:{entity:{type:String,default:"resource"},backends:{type:Array,default:[]},...a.c.props},computed:{unsupported(){if(0===r.c.size(this.federation))return this.backends;{let e=Object.keys(this.federation),t=Array.isArray(this.backends)?this.backends:e;return e.filter((e=>!t.includes(e)))}},services(){return this.backends.map((e=>{let t={title:e};return r.c.isObject(this.federation)&&e in this.federation&&Object.assign(t,this.federation[e]),t}))}}},o=l;var c=s(2528),d=(0,c.c)(o,i,n,!1,null,null,null);const u=d.exports}}]);
//# sourceMappingURL=252.8c8ea151.js.map