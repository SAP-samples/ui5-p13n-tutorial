//@ui5-bundle sample/p13n/app/Component-preload.js
sap.ui.require.preload({
	"sample/p13n/app/Component.js":function(){
"use strict";sap.ui.define(["sap/ui/core/UIComponent"],function(t){"use strict";const i=t.extend("sample.p13n.app.Component",{metadata:{manifest:"json"},init:function i(){t.prototype.init.call(this);this.getRouter().initialize()}});return i});
},
	"sample/p13n/app/control/P13nTable.js":function(){
"use strict";sap.ui.define(["sap/m/Table","sap/m/p13n/Engine","sap/m/p13n/SelectionController","sap/m/p13n/MetadataHelper","sap/m/Text","sap/m/p13n/SortController","sap/m/p13n/GroupController","sap/ui/model/Sorter","sap/m/p13n/FilterController","sap/ui/model/Filter","sap/m/OverflowToolbar","sap/m/Label"],function(t,e,n,s,i,o,r,a,l,h,c,p){"use strict";const u=t.extend("sample.p13n.app.control.P13nTable",{renderer:"sap/m/TableRenderer",constructor:function n(s,i){t.prototype.constructor.call(this,s,i);this.engine=e.getInstance();this.initialized=new Promise(t=>{this.attachEventOnce("updateFinished",()=>{this.initP13n();t()},this)})},initP13n:function t(){const e=this.getColumns();const i=e.map((t,e)=>{const n=t.getHeader();const s=this.getItems()[0];const i=s.getCells()[e];return{key:t.data("p13nKey"),label:n.getText(false),path:i.getBinding(i.isA("sap.m.ObjectIdentifier")?"title":"text").getPath()}});this.helper=new s(i);this.engine.register(this,{helper:this.helper,controller:{Columns:new n({control:this,targetAggregation:"columns"}),Sorter:new o({control:this}),Groups:new r({control:this}),Filter:new l({control:this})}});this.engine.attachStateChange(t=>{const e=t.getParameters();if(e["control"]===this){this.onStateChange(e["state"])}})},onStateChange:function t(e){this.getColumns().forEach(t=>{t.setVisible(e.Columns.some(e=>t.data("p13nKey")===e.key))});e.Columns.forEach(this.moveColum,this);const n=[];e.Groups.forEach(t=>{n.push(new a(this.helper.getPath(t.key),undefined,true))});e.Sorter.forEach(t=>{n.push(new a(this.helper.getPath(t.key),t.descending))});const s=[];let i;Object.keys(e.Filter).forEach(t=>{const n=this.helper.getProperty(t).label;i=i?i+", "+n:n;const o=this.helper.getPath(t);e.Filter[t].forEach(t=>{const e=t.operator;s.push(new h(o,e,t.values[0]))})});const o=this.getBinding("items");o?.sort(n);o?.filter(s);this.setFilterInfoText(i)},moveColum:function t(e,n){const s=this.getColumns().find(t=>t.data("p13nKey")===e.key);if(s===undefined)return;const i=this.getColumns().indexOf(s);if(n!=i){this.removeColumn(s);this.insertColumn(s,n);const t=t=>{if(t?.isA("sap.m.ColumnListItem")){const e=t.removeCell(i);if(e!=null)t.insertCell(e,n)}};const e=this.getBindingInfo("items");t(e.template);this.getItems().forEach(e=>t(e))}},openP13n:function t(e){this.engine.show(this,["Columns","Sorter","Groups","Filter"],{title:"Table Settings",source:e.getSource()})},setFilterInfoText:function t(e){const n=this.getInfoToolbar();if(e&&!n){this.setInfoToolbar(new c({design:"Info",active:true,content:[new i({text:"Filtered by:"}),new p({text:e})]}))}else if(e){const t=n.getContent()[1];t.setText(e)}else if(n){n.destroy()}},applyState:async function t(e){await this.initialized;return this.engine.applyState(this,e)},retrieveState:async function t(){await this.initialized;return this.engine.retrieveState(this)}});return u});
},
	"sample/p13n/app/controller/Mountains.controller.js":function(){
"use strict";sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/MessageToast"],function(n,e){"use strict";const s="range";const t=n.extend("sample.p13n.app.controller.MountainsController",{onInit:function n(){},onP13nPress:function n(e){const s=this.byId("table");s.openP13n(e)},onToggleRange:async function n(t){const o=this.byId("table");const a=t.getSource().getPressed();const i=await o.retrieveState();const c=i.Columns.find(n=>n.key==s);if(a&&c){c.visible=false;e.show("Range hidden")}else{i.Columns.push({key:s,index:0});e.show("Range shown")}o.applyState(i)}});return t});
},
	"sample/p13n/app/manifest.json":'{"_version":"1.12.0","sap.app":{"id":"sample.p13n.app","type":"application","applicationVersion":{"version":"0.0.1"},"title":"Mountain Filter Grid","description":"Personalization Engine Sample Application","resources":"resources.json","dataSources":{"mountains":{"uri":"model/mountains.json","type":"JSON"},"filters":{"uri":"model/filters.json","type":"JSON"}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":true,"dependencies":{"minUI5Version":"1.104.0","libs":{"sap.m":{},"sap.ui.core":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"mountains":{"type":"sap.ui.model.json.JSONModel","dataSource":"mountains"},"filters":{"type":"sap.ui.model.json.JSONModel","dataSource":"filters"}},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"sample.p13n.app.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"RouteMainView","pattern":"RouteMainView","target":["TargetMainView"]}],"targets":{"TargetMainView":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewId":"Mountains","viewName":"Mountains"}}},"rootView":{"viewName":"sample.p13n.app.view.Mountains","type":"XML","async":true,"id":"Mountains"}}}',
	"sample/p13n/app/view/Mountains.view.xml":'<mvc:View\n\theight="100%"\n\tdisplayBlock="true"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns="sap.m"\n\txmlns:f="sap.f"\n\txmlns:core="sap.ui.core"\n\txmlns:ctl="sample.p13n.app.control"\n\tcontrollerName="sample.p13n.app.controller.Mountains"\n\txmlns:sap.ui.fl="sap.ui.fl"\n\txmlns:custom.data="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1"><f:DynamicPage id="dynamicPageId"><f:title><f:DynamicPageTitle><f:heading><Title text="Mountain Filter Grid" /></f:heading><f:actions><ToggleButton\n\t\t\t\t\t\tid="toggleRangeButton"\n\t\t\t\t\t\ttext="Toggle Range"\n\t\t\t\t\t\tpress=".onToggleRange"\n\t\t\t\t\t\ttype="Transparent"/><Button\n\t\t\t\t\t\tid="p13nButton"\n\t\t\t\t\t\ticon="sap-icon://action-settings"\n\t\t\t\t\t\ttype="Transparent"\n\t\t\t\t\t\tpress=".onP13nPress"/></f:actions></f:DynamicPageTitle></f:title><f:header><f:DynamicPageHeader pinnable="true"></f:DynamicPageHeader></f:header><f:content><VBox><ctl:P13nTable\n\t\t\t\t\tid="table"\n\t\t\t\t\tinset="false"\n\t\t\t\t\titems="{mountains>/mountains}"\n\t\t\t\t\tsap.ui.fl:flexibility="sap/m/flexibility/EngineFlex"><ctl:columns><Column\n\t\t\t\t\t\t\tid="name"\n\t\t\t\t\t\t\twidth="12em"\n\t\t\t\t\t\t\tcustom.data:p13nKey="name"><Text text="Name" /></Column><Column\n\t\t\t\t\t\t\tid="height"\n\t\t\t\t\t\t\tminScreenWidth="Tablet"\n\t\t\t\t\t\t\tdemandPopin="true"\n\t\t\t\t\t\t\tcustom.data:p13nKey="height"><Text text="Height" /></Column><Column\n\t\t\t\t\t\t\tid="prominence"\n\t\t\t\t\t\t\tminScreenWidth="Tablet"\n\t\t\t\t\t\t\tdemandPopin="true"\n\t\t\t\t\t\t\tcustom.data:p13nKey="prominence"><Text text="Prominence" /></Column><Column\n\t\t\t\t\t\t\tid="range"\n\t\t\t\t\t\t\tminScreenWidth="Tablet"\n\t\t\t\t\t\t\tdemandPopin="true"\n\t\t\t\t\t\t\tcustom.data:p13nKey="range"><Text text="Range" /></Column><Column\n\t\t\t\t\t\t\tid="coordinates"\n\t\t\t\t\t\t\tminScreenWidth="Tablet"\n\t\t\t\t\t\t\tdemandPopin="true"\n\t\t\t\t\t\t\tcustom.data:p13nKey="coordinates"><Text text="Coordinates" /></Column><Column\n\t\t\t\t\t\t\tid="parent_mountain"\n\t\t\t\t\t\t\tminScreenWidth="Tablet"\n\t\t\t\t\t\t\tdemandPopin="true"\n\t\t\t\t\t\t\tcustom.data:p13nKey="parent_mountain"><Text text="Parent Mountain" /></Column><Column\n\t\t\t\t\t\t\tid="first_ascent"\n\t\t\t\t\t\t\tminScreenWidth="Tablet"\n\t\t\t\t\t\t\tdemandPopin="true"\n\t\t\t\t\t\t\tcustom.data:p13nKey="first_ascent"><Text text="First Ascent" /></Column><Column\n\t\t\t\t\t\t\tid="countries"\n\t\t\t\t\t\t\tminScreenWidth="Tablet"\n\t\t\t\t\t\t\tdemandPopin="true"\n\t\t\t\t\t\t\tcustom.data:p13nKey="countries"><Text text="Countries" /></Column></ctl:columns><ctl:items><ColumnListItem vAlign="Middle"><cells><ObjectIdentifier\n\t\t\t\t\t\t\t\t\ttitle="{mountains>name}"\n\t\t\t\t\t\t\t\t\ttext="{mountains>range}" /><Text text="{mountains>height}" /><Text text="{mountains>prominence}" /><Text text="{mountains>range}" /><Text text="{mountains>coordinates}" /><Text text="{mountains>parent_mountain}" /><Text text="{mountains>first_ascent}" /><Text text="{mountains>countries}" /></cells></ColumnListItem></ctl:items></ctl:P13nTable></VBox></f:content></f:DynamicPage></mvc:View>'
});
//# sourceMappingURL=Component-preload.js.map
