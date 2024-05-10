"use strict";

sap.ui.define(["sap/m/Table"], function (Table) {
  "use strict";

  /**
   * @namespace sample.p13n.app.control
   */
  const P13nTable = Table.extend("sample.p13n.app.control.P13nTable", {
    renderer: "sap/m/TableRenderer",
    constructor: function _constructor(id, settings) {
      Table.prototype.constructor.call(this, id, settings);
    }
  });
  return P13nTable;
});
//# sourceMappingURL=P13nTable-dbg.js.map
