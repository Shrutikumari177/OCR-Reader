sap.ui.define([
    "sap/ui/core/mvc/Controller"
  ], (BaseController) => {
    "use strict";
  
    return BaseController.extend("com.ingenx.documentextract.controller.Tile", {
        onInit() {
        },
        onPressInvoiceScan: function () {
            const tile = this.getOwnerComponent().getRouter();
            tile.navTo("RouteInvoiceScan");
        },
    });
  });