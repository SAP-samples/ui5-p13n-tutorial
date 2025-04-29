sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
  "use strict";

  /**
   * @namespace sample.p13n.app.controller
   */
  const MountainsController = Controller.extend("sample.p13n.app.controller.MountainsController", {
    onInit: function _onInit() {},
    onP13nPress: function _onP13nPress(event) {
      const p13nTable = this.byId("table");
      p13nTable.openP13n(event);
    }
  });
  return MountainsController;
});
//# sourceMappingURL=Mountains-dbg.controller.js.map
