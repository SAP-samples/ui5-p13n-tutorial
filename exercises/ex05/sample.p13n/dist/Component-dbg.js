sap.ui.define(["sap/ui/core/UIComponent"], function (UIComponent) {
  "use strict";

  /**
   * @namespace sample.p13n.app
   */
  const Component = UIComponent.extend("sample.p13n.app.Component", {
    metadata: {
      manifest: "json"
    },
    init: function _init() {
      // call the base component's init function
      UIComponent.prototype.init.call(this);

      // enable routing
      this.getRouter().initialize();
    }
  });
  return Component;
});
//# sourceMappingURL=Component-dbg.js.map
