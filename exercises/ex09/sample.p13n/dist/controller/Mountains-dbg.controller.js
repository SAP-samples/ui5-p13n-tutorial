"use strict";

sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageToast", "sap/m/p13n/SelectionController", "sap/m/p13n/Engine", "sap/m/p13n/MetadataHelper"], function (Controller, MessageToast, SelectionController, Engine, MetadataHelper) {
  "use strict";

  const RANGE_COLUMN_KEY = 'range';

  /**
   * @namespace sample.p13n.app.controller
   */
  const MountainsController = Controller.extend("sample.p13n.app.controller.MountainsController", {
    onInit: function _onInit() {
      this.engine = Engine.getInstance();
      this.initGridFilter();
    },
    initGridFilter: function _initGridFilter() {
      const gridList = this.byId("gridFilter");
      const filterModel = gridList.getModel("filters");
      const aFilterMetadata = gridList.getItems().map((gridListItem, index) => {
        return {
          path: "",
          key: gridListItem.getId(),
          label: filterModel.getData().filters[index].label
        };
      });
      const filterHelper = new MetadataHelper(aFilterMetadata);
      this.engine.register(gridList, {
        helper: filterHelper,
        controller: {
          Items: new SelectionController({
            control: gridList,
            targetAggregation: "items"
          })
        }
      });
      this.engine.attachStateChange(this.onP13nStateChange.bind(this));
    },
    onP13nStateChange: function _onP13nStateChange(event) {
      const parameters = event.getParameters();
      const state = parameters.state;
      const gridList = this.byId("gridFilter");
      if (parameters.control === gridList) {
        gridList.getItems().forEach(gridListItem => {
          gridListItem.setSelected(state.Items.some(selectionState => {
            return gridListItem.getId() === selectionState.key;
          }));
        });
      }
    },
    onGridFilterPress: function _onGridFilterPress(event) {
      const gridList = this.byId("gridFilter");
      this.engine.show(gridList, ["Items"], {
        title: "Filter Selection",
        source: event.getSource()
      });
    },
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
