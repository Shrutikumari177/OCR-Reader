sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/BusyDialog"
], function (Controller, MessageToast, JSONModel, BusyDialog) {
    "use strict";
    let base64String;

    return Controller.extend("com.ingenx.documentextract.controller.docExtract", {
        
        onInit: function () {
            // Initialize JSON Model
            var oData = { headerFields: [] 
                }; 
            
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "headerModel");

            this.oModel = this.getOwnerComponent().getModel(); // OData V4 model

            // Create BusyDialog instance
            this._busyDialog = new BusyDialog({
                text: "Extracting data from document...",
                title: "Please wait..."
            });
        },

        handleUploadPress: function () {
            var oFileUploader = this.getView().byId("fileUploader");
            var oFile = oFileUploader.oFileUpload.files[0];

            if (!oFile) {
                MessageToast.show("Please select a file to upload.");
                return;
            }

            var reader = new FileReader();
            reader.onload = function (e) {
                var base64String = e.target.result.split(",")[1]; 
                console.log("Base64 Encoded File:", base64String);

                var fileName = oFile.name;  
                console.log("File Name:", fileName);

                // Show Busy Dialog before sending request
                this._busyDialog.open();

                this._sendToBackend(base64String, fileName);
            }.bind(this); 

            reader.readAsDataURL(oFile);
        },

       
        _sendToBackend: async function (base64Data, fileName) {
            try {
                console.log("Sending payload to backend...");
        
                var oModel = this.getOwnerComponent().getModel();
                if (!oModel) {
                    throw new Error("OData V4 model not found.");
                }
        
                let sAction = "/uploadDocument(...)";
                const oContext = oModel.bindContext(sAction, undefined);
        
                oContext.setParameter("file", base64Data);
                oContext.setParameter("fileName", fileName);
        
                await oContext.execute();
        
                const responseData = oContext.getBoundContext().getObject();
                console.log("Upload response:", responseData);
        
                if (responseData && responseData.value && responseData.value.result && responseData.value.result.headerFields) {
                    var oHeaderModel = this.getView().getModel("headerModel");
                    oHeaderModel.setProperty("/headerFields", responseData.value.result.headerFields);
        
                    this.getView().byId("TableBlocklayoutRow").setVisible(true);
                } else {
                    throw new Error("Invalid response format: Missing value.result.headerFields");
                }
        
                var oFileUploader = this.getView().byId("fileUploader"); 
                if (oFileUploader) {
                    oFileUploader.clear();
                }
        
                this._busyDialog.close();
        
                MessageToast.show(responseData.value.message || "File uploaded successfully!");
        
            } catch (error) {
                console.error("Error uploading file:", error);
                this._busyDialog.close();
                sap.m.MessageBox.error(error.message || "An unexpected error occurred");
            }
        }
        
        
        
        
    });
});
