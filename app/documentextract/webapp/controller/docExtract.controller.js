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
                
                var fileName = oFile.name;  
                console.log("File Name:", fileName);
        
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
        
                // Retrieve response data
                const responseData = oContext.getBoundContext().getObject();
                console.log("Upload response:", responseData); // Log response
        
                
        
                sap.m.MessageToast.show("File uploaded successfully");
        
            } catch (error) {
                console.error("Error uploading file:", error);
                sap.m.MessageBox.error(error.message);
            }
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

        // Retrieve response data
        const responseData = oContext.getBoundContext().getObject();
        console.log("Upload response:", responseData);

        // ✅ Check if headerFields exist
        if (responseData.value && responseData.value.result && responseData.value.result.headerFields) {
            let headerFields = responseData.value.result.headerFields;

            // ✅ Create a new JSON model for the table
            var oJsonModel = new sap.ui.model.json.JSONModel();
            oJsonModel.setData({ headerFields: headerFields });

            // ✅ Set the model to the view
            this.getView().setModel(oJsonModel, "HeaderFieldsModel");

            console.log("Header fields stored in model:", headerFields);
        } else {
            console.warn("No header fields found in response.");
        }

        sap.m.MessageToast.show("File uploaded successfully");

    } catch (error) {
        console.error("Error uploading file:", error);
        sap.m.MessageBox.error(error.message);
    }
}

      
        
        
     
        
        
       
        
      
        
        
        
        
        
        
       
        
          
       
           });
});
