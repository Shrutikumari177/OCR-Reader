sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/odata/v4/ODataModel"
], function (Controller, MessageToast, ODataModel) {
    "use strict";

    return Controller.extend("com.ingenx.documentextract.controller.docExtract", {
        
        onInit: function () {
            this.oModel = this.getOwnerComponent().getModel(); // Ensure OData V4 model is set in manifest.json
        },
        

        // handleUploadPress: function () {
        //     var oFileUploader = this.getView().byId("fileUploader");
        //     var oFile = oFileUploader.oFileUpload.files[0];

        //     if (!oFile) {
        //         MessageToast.show("Please select a file to upload.");
        //         return;
        //     }

        //     var that = this;
        //     var reader = new FileReader();

        //     reader.onload = function (e) {
        //         var binaryData = e.target.result.split(",")[1]; 
        //         that._uploadDocument(binaryData, oFile.name);
        //     };

        //     reader.readAsDataURL(oFile);
        // },

        // _uploadDocument: function (binaryData, fileName) {
        //     var that = this;
        //     var sAction = "/uploadDocument(...)";

        //     // Bind context for OData V4 action execution
        //     const oContext = this.oModel.bindContext(sAction, undefined);
        //     oContext.setParameter("file", binaryData);
        //     oContext.setParameter("fileName", fileName);

        //     oContext.execute().then(function (oResponse) {
        //         MessageToast.show("File uploaded successfully!");
        //         console.log("Upload Response:", oResponse);

        //         // Fetch extracted document data
        //         that._getDocumentStatus(oResponse.jobId);

        //     }).catch(function (oError) {
        //         MessageToast.show("Upload failed. Check console for details.");
        //         console.error("Upload Error:", oError);
        //     });
        // },

        // _getDocumentStatus: function (jobId) {
        //     var that = this;
        //     var sAction = "/getDocumentStatus(...)";

        //     // Bind context for OData V4 function import execution
        //     const oContext = this.oModel.bindContext(sAction, undefined);
        //     oContext.setParameter("jobId", jobId);

        //     oContext.execute().then(function (oData) {
        //         console.log("Extracted Data:", oData);
                
        //         var oTable = that.getView().byId("extractedTable");
        //         var oTableModel = new sap.ui.model.json.JSONModel(oData);
                
        //         oTable.setModel(oTableModel);
        //         oTable.bindItems({
        //             path: "/fields",
        //             template: new sap.m.ColumnListItem({
        //                 cells: [
        //                     new sap.m.Text({ text: "{key}" }),
        //                     new sap.m.Text({ text: "{value}" })
        //                 ]
        //             })
        //         });

        //         oTable.setVisible(true);

        //     }).catch(function (oError) {
        //         MessageToast.show("Failed to retrieve extracted data.");
        //         console.error("Document Status Error:", oError);
        //     });
        // }
    });
});
