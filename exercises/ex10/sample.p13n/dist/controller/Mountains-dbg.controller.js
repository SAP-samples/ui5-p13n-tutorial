sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageToast", "sap/m/p13n/Engine", "sap/m/p13n/MetadataHelper", "sap/m/p13n/SelectionController", "sap/ui/core/Element", "sap/ui/model/Filter"], function (Controller, MessageToast, Engine, MetadataHelper, SelectionController, Element, Filter) {
  "use strict";

  const RANGE_COLUMN_KEY = 'container-sample.p13n.app---Mountains--range';

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
      const gridListItems = gridList.getItems();
      const filterMetadata = gridListItems.map((gridListItem, index) => {
        return {
          path: "",
          key: gridListItem.getId(),
          label: filterModel.getData().filters[index].label
        };
      });
      const filterHelper = new MetadataHelper(filterMetadata);
      this.engine.register(gridList, {
        helper: filterHelper,
        controller: {
          Items: new SelectionController({
            control: gridList,
            targetAggregation: "items",
            getKeyForItem: gridListItem => {
              const listBinding = this.byId("table").getBinding("items");
              return listBinding.getFilters("Control").some(filter => {
                const expression = gridListItem.getBindingContext("filters").getProperty("expression");
                return filter.getPath() === expression[0] && filter.getValue1() === expression[2];
              });
            }
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
        const filters = [];
        let filterText;
        state.Items.forEach(selectionState => {
          const item = Element.getElementById(selectionState.key);
          if (item) {
            const filterContext = item.getBindingContext("filters");
            const expression = filterContext.getProperty("expression");
            const description = filterContext.getProperty("description");
            filters.push(new Filter(expression[0], expression[1], expression[2]));
            filterText = filterText ? filterText + ", " + description : description;
          }
        });
        const table = this.byId("table");
        const tableBinding = table.getBinding("items");
        tableBinding.filter(filters);
        table.setFilterInfoText(filterText);
      }
    },
    onGridFilterPress: function _onGridFilterPress(event) {
      const gridList = this.byId("gridFilter");
      this.engine.show(gridList, ["Items"], {
        title: "Filter Selection",
        source: event.getSource()
      });
    },
    onGridFilterSelect: function _onGridFilterSelect(event) {
      const gridList = this.byId("gridFilter");
      const parameters = event.getParameters();
      const item = parameters.listItem;
      this.engine.retrieveState(gridList).then(state => {
        const itemId = item.getId();
        const oStateItem = state.Items.find(selectionState => {
          return selectionState.key == itemId;
        });
        if (item.getSelected()) {
          state.Items.push({
            key: itemId
          });
        } else {
          oStateItem.visible = false;
        }
        this.engine.applyState(gridList, state);
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
