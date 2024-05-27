"use strict";sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/MessageToast","sap/m/p13n/SelectionController","sap/m/p13n/Engine","sap/m/p13n/MetadataHelper"],function(e,t,n,s,i){"use strict";const o="range";const r=e.extend("sample.p13n.app.controller.MountainsController",{onInit:function e(){this.engine=s.getInstance();this.initGridFilter()},initGridFilter:function e(){const t=this.byId("gridFilter");const s=t.getModel("filters");const o=t.getItems().map((e,t)=>({path:"",key:e.getId(),label:s.getData().filters[t].label}));const r=new i(o);this.engine.register(t,{helper:r,controller:{Items:new n({control:t,targetAggregation:"items",getKeyForItem:e=>e.getSelected()})}});this.engine.attachStateChange(this.onP13nStateChange.bind(this))},onP13nStateChange:function e(t){const n=t.getParameters();const s=n.state;const i=this.byId("gridFilter");if(n.control===i){i.getItems().forEach(e=>{e.setSelected(s.Items.some(t=>e.getId()===t.key))})}},onGridFilterPress:function e(t){const n=this.byId("gridFilter");this.engine.show(n,["Items"],{title:"Filter Selection",source:t.getSource()})},onP13nPress:function e(t){const n=this.byId("table");n.openP13n(t)},onToggleRange:async function e(n){const s=this.byId("table");const i=n.getSource().getPressed();const r=await s.retrieveState();const a=r.Columns.find(e=>e.key==o);if(i&&a){a.visible=false;t.show("Range hidden")}else{r.Columns.push({key:o,index:0});t.show("Range shown")}s.applyState(r)}});return r});
//# sourceMappingURL=Mountains.controller.js.map