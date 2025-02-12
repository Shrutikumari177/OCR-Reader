sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/BusyDialog",
    "sap/m/MessageBox"
], function (Controller, MessageToast, JSONModel, BusyDialog,MessageBox) {
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
                    
                    // Format header fields (replace camelCase or PascalCase with spaces)
                    var formattedHeaderFields = responseData.value.result.headerFields.map(item => {
                        return {
                            name: item.name.replace(/([a-z])([A-Z])/g, '$1 $2'), // Add space between camelCase/PascalCase words
                            value: item.value,
                            isEdit: false // Set initial edit state to false
                        };
                    });
        
                    oHeaderModel.setProperty("/headerFields", formattedHeaderFields);
                    oHeaderModel.setProperty("/isEditing", false);
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
        },
        
        handleEdit: function () {
            var oModel = this.getView().getModel("headerModel");
            
            // Enable editing mode
            oModel.setProperty("/isEditing", true);
        
            var aData = oModel.getProperty("/headerFields");
            aData.forEach(function (item) {
                item.isEdit = true;  // Enable editing
            });
        
            oModel.setProperty("/headerFields", aData);
        },
        
        handleSave: function () {
            var oModel = this.getView().getModel("headerModel");
            
            // Disable editing mode
            oModel.setProperty("/isEditing", false);
        
            var aData = oModel.getProperty("/headerFields");
            aData.forEach(function (item) {
                item.isEdit = false;  // Disable editing
            });
        
            oModel.setProperty("/headerFields", aData);
            sap.m.MessageToast.show("Data saved successfully!");
        },
        handleSubmit: function () {
           
            sap.m.MessageToast.show(" Invoice Data saved successfully!");
        }
        
        
        
        
        
        
    });
});
