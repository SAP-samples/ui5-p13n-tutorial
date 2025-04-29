sap.ui.define(["sap/m/Table", "sap/m/p13n/Engine", "sap/m/p13n/SelectionController", "sap/m/p13n/MetadataHelper"], function (Table, Engine, SelectionController, MetadataHelper) {
  "use strict";

  /**
   * @namespace sample.p13n.app.control
   */
  const P13nTable = Table.extend("sample.p13n.app.control.P13nTable", {
    renderer: "sap/m/TableRenderer",
    constructor: function _constructor(id, settings) {
      Table.prototype.constructor.call(this, id, settings);
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
            targetAggregation: "columns"
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
      this.engine.show(this, ["Columns"], {
        title: "Table Settings",
        source: event.getSource()
      });
    }
  });
  return P13nTable;
});
//# sourceMappingURL=P13nTable-dbg.js.map
