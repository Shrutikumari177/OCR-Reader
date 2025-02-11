sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/odata/v4/ODataModel"
], function (Controller, MessageToast, ODataModel) {
    "use strict";
    let base64String;

    return Controller.extend("com.ingenx.documentextract.controller.docExtract", {
        
        onInit: function () {
            this.oModel = this.getOwnerComponent().getModel(); // Ensure OData V4 model is set in manifest.json
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
        
                // Call backend function with Base64 data
                this._sendToBackend(base64String);
            }.bind(this);  // Bind 'this' to use instance methods
        
            reader.readAsDataURL(oFile);
        },
        
        _sendToBackend: async function (base64Data) {
            try {
                console.log("Sending payload to backend...");
                
        
                var oModel = this.getOwnerComponent().getModel();
                if (!oModel) {
                    throw new Error("OData V4 model not found.");
                }
        
                let sAction = "/uploadDocument(...)";
                const oContext = oModel.bindContext(sAction, undefined);
        
                // Set parameters dynamically
                oContext.setParameter("file", base64Data);
        
                await oContext.execute();
        
                sap.m.MessageToast.show("File uploaded successfully");
        
            } catch (error) {
                console.error("Error uploading file:", error);
                sap.m.MessageBox.error(error.message);
            }
        },
        _sendToBacken1d: async function (base64Data) {
            try {
                console.log("Sending payload to backend...");
        
                var oModel = this.getOwnerComponent().getModel();
                if (!oModel) {
                    throw new Error("OData V4 model not found.");
                }
        
                let sAction = "/uploadDocument(...)";
                const oContext = oModel.bindContext(sAction, undefined);
        
                // Set parameters dynamically
                oContext.setParameter("file", base64Data);
        
                // Attach event to get the response after execution
                oContext.attachCompleted(function (oEvent) {
                    var oResponse = oEvent.getParameter("response"); // Get the response object
                    console.log("Upload Response:", oResponse);
        
                    if (oResponse && oResponse.statusCode === 200) {
                        sap.m.MessageToast.show("File uploaded successfully");
                    } else {
                        sap.m.MessageBox.error("File upload failed: " + (oResponse ? oResponse.message : "Unknown error"));
                    }
                });
        
                await oContext.execute();
        
            } catch (error) {
                console.error("Error uploading file:", error);
                sap.m.MessageBox.error(error.message);
            }
        }
        
          
       
           });
});
