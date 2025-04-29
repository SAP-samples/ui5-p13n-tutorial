sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageToast"], function (Controller, MessageToast) {
  "use strict";

  const RANGE_COLUMN_KEY = 'range';

  /**
   * @namespace sample.p13n.app.controller
   */
  const MountainsController = Controller.extend("sample.p13n.app.controller.MountainsController", {
    onInit: function _onInit() {},
    onP13nPress: function _onP13nPress(event) {
      const p13nTable = this.byId("table");
      p13nTable.openP13n(event);
    },
    onToggleRange: async function _onToggleRange(event) {
      const p13nTable = this.byId("table");
      const pressed = event.getSource().getPressed();
      const state = await p13nTable.retrieveState();
      const rangeColumnState = state.Columns.find(selectionState => {
        return selectionState.key == RANGE_COLUMN_KEY;
      });
      if (pressed && rangeColumnState) {
        rangeColumnState.visible = false;
        MessageToast.show("Range hidden");
      } else {
        state.Columns.push({
          key: RANGE_COLUMN_KEY,
          index: 0
        });
        MessageToast.show("Range shown");
      }
      p13nTable.applyState(state);
    }
  });
  return MountainsController;
});
//# sourceMappingURL=Mountains-dbg.controller.js.map
