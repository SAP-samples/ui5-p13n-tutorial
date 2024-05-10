"use strict";

sap.ui.define(["sap/m/Table", "sap/m/p13n/Engine", "sap/m/p13n/SelectionController", "sap/m/p13n/MetadataHelper", "sap/m/Text", "sap/m/p13n/SortController", "sap/m/p13n/GroupController", "sap/ui/model/Sorter", "sap/m/p13n/FilterController", "sap/ui/model/Filter", "sap/m/OverflowToolbar", "sap/m/Label"], function (Table, Engine, SelectionController, MetadataHelper, Text, SortController, GroupController, Sorter, FilterController, Filter, OverflowToolbar, Label) {
  "use strict";

  /**
   * @namespace sample.p13n.app.control
   */
  const P13nTable = Table.extend("sample.p13n.app.control.P13nTable", {
    renderer: "sap/m/TableRenderer",
    constructor: function _constructor(id, settings) {
      Table.prototype.constructor.call(this, id, settings);
      // @ts-ignore  TODO: FIX static method declaration
      this.engine = Engine.getInstance();
      this.initialized = new Promise(resolve => {
        this.attachEventOnce("updateFinished", () => {
          this.initP13n();
          resolve();
        }, this);
      });
    },
    initP13n: function _initP13n() {
      const columns = this.getColumns();
      const columnsMetadata = columns.map((column, index) => {
        const columnHeader = column.getHeader();
        const columnListItem = this.getItems()[0];
        const innerControl = columnListItem.getCells()[index];
        return {
          key: column.data("p13nKey"),
          label: columnHeader.getText(false),
          path: innerControl.getBinding(innerControl.isA("sap.m.ObjectIdentifier") ? "title" : "text").getPath()
        };
      });
      this.helper = new MetadataHelper(columnsMetadata);
      this.engine.register(this, {
        helper: this.helper,
        controller: {
          Columns: new SelectionController({
            control: this,
            targetAggregation: "columns",
            getKeyForItem: column => {
              return column.data("p13nKey");
            }
          }),
          Sorter: new SortController({
            control: this
          }),
          Groups: new GroupController({
            control: this
          }),
          Filter: new FilterController({
            control: this
          })
        }
      });
      this.engine.attachStateChange(event => {
        const parameters = event.getParameters();
        if (parameters["control"] === this) {
          this.onStateChange(parameters["state"]);
        }
      });
    },
    onStateChange: function _onStateChange(state) {
      this.getColumns().forEach(column => {
        // if the column is not in the state, it is not visible
        column.setVisible(state.Columns.some(selectionState => {
          return column.data("p13nKey") === selectionState.key;
        }));
      });
      state.Columns.forEach(this.moveColum, this);
      const sorters = [];
      state.Groups.forEach(groupState => {
        sorters.push(new Sorter(this.helper.getPath(groupState.key), undefined, true));
      });
      state.Sorter.forEach(sortState => {
        sorters.push(new Sorter(this.helper.getPath(sortState.key), sortState.descending));
      });
      const filters = [];
      let filterInfoText;
      Object.keys(state.Filter).forEach(filterKey => {
        const label = this.helper.getProperty(filterKey).label;
        filterInfoText = filterInfoText ? filterInfoText + ", " + label : label;
        const filterPath = this.helper.getPath(filterKey);
        state.Filter[filterKey].forEach(filterStateItem => {
          const operator = filterStateItem.operator;
          filters.push(new Filter(filterPath, operator, filterStateItem.values[0]));
        });
      });
      const listBinding = this.getBinding("items");
      listBinding?.sort(sorters);
      listBinding?.filter(filters);
      this.setFilterInfoText(filterInfoText);
    },
    moveColum: function _moveColum(selectionState, index) {
      const column = this.getColumns().find(column => {
        return column.data("p13nKey") === selectionState.key;
      });
      if (column === undefined) return;
      const oldIndex = this.getColumns().indexOf(column);
      if (index != oldIndex) {
        this.removeColumn(column);
        this.insertColumn(column, index);
        const fnMoveCells = columnListItem => {
          if (columnListItem?.isA("sap.m.ColumnListItem")) {
            const cell = columnListItem.removeCell(oldIndex);
            if (cell != null) columnListItem.insertCell(cell, index);
          }
        };
        const itemsBindingInfo = this.getBindingInfo("items");
        fnMoveCells(itemsBindingInfo.template);
        this.getItems().forEach(item => fnMoveCells(item));
      }
    },
    openP13n: function _openP13n(event) {
      this.engine.show(this, ["Columns", "Sorter", "Groups", "Filter"], {
        title: "Table Settings",
        source: event.getSource()
      });
    },
    setFilterInfoText: function _setFilterInfoText(filterInfoText) {
      const infoToolbar = this.getInfoToolbar();
      if (filterInfoText && !infoToolbar) {
        this.setInfoToolbar(new OverflowToolbar({
          design: "Info",
          active: true,
          content: [new Text({
            text: "Filtered by:"
          }), new Label({
            text: filterInfoText
          })]
        }));
      } else if (filterInfoText) {
        const label = infoToolbar.getContent()[1];
        label.setText(filterInfoText);
      } else if (infoToolbar) {
        infoToolbar.destroy();
      }
    },
    applyState: async function _applyState(state) {
      await this.initialized;
      return this.engine.applyState(this, state);
    },
    retrieveState: async function _retrieveState() {
      await this.initialized;
      return this.engine.retrieveState(this);
    }
  });
  return P13nTable;
});
//# sourceMappingURL=P13nTable-dbg.js.map
