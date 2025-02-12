const cds = require('@sap/cds');
const axios = require('axios');
const FormData = require('form-data');

const CLIENT_ID = "sb-9278451d-24de-4c53-a322-3f3335539527!b367227|dox-xsuaa-std-trial!b10844";
const CLIENT_SECRET = "438a51cf-503d-4eaf-8bf1-7ffb117ce5b2$GFkS3NcRxr59tO2VCQRUynUQGPpBKUWFOq0rbHqV-ls=";
const TOKEN_URL = "https://7bf65c89trial.authentication.us10.hana.ondemand.com/oauth/token?grant_type=client_credentials";
const DOX_API_URL = "https://aiservices-trial-dox.cfapps.us10.hana.ondemand.com/document-information-extraction/v1/document/jobs";

module.exports = cds.service.impl(async function () {
    const { Documents, InvoiceDetails } = this.entities;

  
   
   
    this.on('uploadDocument', async (req) => {
        try {
            console.log("📂 Upload process started...");
    
            const { file, fileName = "uploaded_document.pdf" } = req.data;
            if (!file) {
            
                return req.error(400, 'File is required');
            }
    
            console.log("🔹 Step 1: Fetching Access Token & Preparing File Upload...");
            const [accessToken, formData] = await Promise.all([
                getAccessToken(),
                prepareFileUpload(file, fileName)
            ]);
    
    
            console.log("🔹 Step 2: Uploading Document to DOX...");
            const jobId = await uploadToDOX(formData, accessToken);
    
            if (!jobId) {
                console.error("❌ Error: Job ID not received after upload");
                return req.error(500, "Failed to upload document to DOX");
            }
            console.log("✅ Document uploaded. Job ID:", jobId);
    
            console.log("🔹 Step 3: Saving to Database...");
            await cds.run(INSERT.into(Documents).entries({
                ID: cds.utils.uuid(),
                name: fileName,
                jobId: jobId,
                status: "Submitted"
            }));
            console.log("✅ Database entry created for Job ID:", jobId);
    
            console.log("🔹 Step 4: Fetching Document Status...");
            const result = await getDocumentStatus(jobId, accessToken);
    
            console.log("✅ Document status received:", JSON.stringify(result, null, 2));
    
            return { message: "Document uploaded successfully!", jobId, result };
    
        } catch (error) {
            console.error("❌ Upload failed:", error);
            return req.error(500, "Failed to upload document");
        }
    });
    
    
    // Function to Generate Access Token
    async function getAccessToken() {
        const response = await axios.post(
            TOKEN_URL,
            new URLSearchParams({ grant_type: "client_credentials" }),
            { auth: { username: CLIENT_ID, password: CLIENT_SECRET } }
        );
        return response.data.access_token;
    }
    
    // Function to Prepare File Upload
    async function prepareFileUpload(file, fileName) {
        const form = new FormData();
        form.append('file', Buffer.from(file, 'base64'), { filename: fileName });
        form.append('options', JSON.stringify({
            clientId: "default",
            documentType: "Custom",
            schemaName: "Custom_Invoice",
            schemaVersion: "1",
            receivedDate: "2020-02-17"
        }));
        return form;
    }
    
    // Function to Upload File to DOX API
    async function uploadToDOX(formData, accessToken) {
        const response = await axios.post(DOX_API_URL, formData, {
            headers: { ...formData.getHeaders(), Authorization: `Bearer ${accessToken}` }
        });
        return response.data.id;
    }
    
    // Optimized Retry Logic for Document Status
    async function getDocumentStatus(jobId, accessToken, maxRetries = 5) {
        let delay = 2000; // Initial 2 sec delay
        for (let i = 0; i < maxRetries; i++) {
            const response = await axios.get(`${DOX_API_URL}/${jobId}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
    
            if (response.data.extraction) {
                return {
                    headerFields: response.data.extraction.headerFields?.map(({ name, value }) => ({ name, value })) || [],
                    lineItems: response.data.extraction.lineItems || []
                };
            }
    
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 1.5; 
        }
    
        throw new Error("Document processing timeout: No extraction data received.");
    }


  
});

    
    
    
    
    
    
  
    
    


  
    

