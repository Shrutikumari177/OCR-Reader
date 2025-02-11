const cds = require('@sap/cds');
const axios = require('axios');
const FormData = require('form-data');

const CLIENT_ID = "sb-24bbed52-8f8b-4d45-8ec4-a76bbb0da1be!b397359|dox-xsuaa-std-trial!b10844";
const CLIENT_SECRET = "8d8a2865-deec-4273-96c7-fd3fb2762a63$cBOcBGS1HsrplpFLDVPGlVpQ1KFzI6-cVqLl9bXRhIA=";
const TOKEN_URL = "https://2a13b2e0trial.authentication.us10.hana.ondemand.com/oauth/token?grant_type=client_credentials";
const DOX_API_URL = "https://aiservices-trial-dox.cfapps.us10.hana.ondemand.com/document-information-extraction/v1/document/jobs";

module.exports = cds.service.impl(async function () {
    const { Documents } = this.entities;

    // // Upload document event
    // this.on('uploadDocument', async (req) => {
    //     console.log("uploadDocument event triggered");

    //     try {
    //         const file = req.data.file;
    //         if (!file) {
    //             console.log("Error: No file provided");
    //             req.error(400, 'File is required');
    //         }

    //         console.log("File received:", req.data.file);

    //         // Step 1: Generate Access Token
    //         console.log("Requesting access token...");
    //         const tokenResponse = await axios.post(
    //             TOKEN_URL,
    //             new URLSearchParams({ grant_type: "client_credentials" }),
    //             {
    //                 auth: {
    //                     username: CLIENT_ID,
    //                     password: CLIENT_SECRET
    //                 }
    //             }
    //         );

    //         const accessToken = tokenResponse.data.access_token;
    //         console.log("Access token received:", accessToken);

    //         // Step 2: Upload Document to DOX API
    //         console.log("Uploading document to DOX API...");
    //         const fileName = req.data.fileName || "uploaded_document.pdf"; // Default if no filename is provided

    //         const form = new FormData();
    //         form.append('file', Buffer.from(file, 'base64'), { filename: fileName });

    //         // form.append('file', Buffer.from(file, 'base64'), { filename: "uploaded_document.pdf" }); 
    //         form.append('options', JSON.stringify({
    //             "clientId": "default",
    //             "documentType": "Custom",
    //             "schemaName": "Custom_Invoice",
    //             "schemaVersion": "1",
    //             "receivedDate": "2020-02-17",
    //             "enrichment": {}
    //         }));

    //         const response = await axios.post(
    //             DOX_API_URL,
    //             form,
    //             {
    //                 headers: {
    //                     ...form.getHeaders(),
    //                     Authorization: `Bearer ${accessToken}`
    //                 }
    //             }
    //         );

    //         console.log("Document uploaded successfully, Response:", response.data);

    //         const jobId = response.data.id;

    //         // Step 3: Save response to the database
    //         console.log("Saving document details to database...");
    //         await cds.run(
    //             INSERT.into(Documents).entries({
    //                 ID: cds.utils.uuid(),
    //                 name: "uploaded_document.pdf",
    //                 jobId: jobId,
    //                 status: "Submitted",
    //                 response: JSON.stringify(response.data)
    //             })
    //         );

    //         console.log("Database entry saved successfully");
    //         return { message: "Document uploaded successfully!", jobId };

    //     } catch (error) {
    //         console.error("Error in uploadDocument:", error);
    //         req.error(500, "Failed to upload document");
    //     }
    // });

    // // Get extracted document data
    // this.on('getDocumentStatus', async (req) => {
    //     try {
    //         const { jobId } = req.data;
    //         if (!jobId) {
    //             return req.error(400, "Job ID is required");
    //         }
    
    //         // Step 1: Generate Access Token
    //         const tokenResponse = await axios.post(
    //             TOKEN_URL,
    //             new URLSearchParams({ grant_type: "client_credentials" }),
    //             {
    //                 auth: {
    //                     username: CLIENT_ID,
    //                     password: CLIENT_SECRET
    //                 }
    //             }
    //         );
    
    //         const accessToken = tokenResponse.data.access_token;
    
    //         // Step 2: Fetch the extracted document data
    //         const response = await axios.get(`${DOX_API_URL}/${jobId}`, {
    //             headers: {
    //                 Authorization: `Bearer ${accessToken}`
    //             }
    //         });
    
    //         const extraction = response.data.extraction;
    
    //         // Filter headerFields to only include name and value
    //         const headerFields = extraction.headerFields.map(({ name, value }) => ({ name, value }));
    
    //         return {
    //             headerFields,
    //             lineItems: extraction.lineItems
    //         };
    
    //     } catch (error) {
    //         req.error(500, "Failed to retrieve document data",error);
    //     }
    // });


    // this.on('uploadDocument', async (req) => {
    //     console.log("uploadDocument event triggered");
    
    //     try {
    //         const file = req.data.file;
    //         if (!file) {
    //             console.log("Error: No file provided");
    //             return req.error(400, 'File is required');
    //         }
    
    //         console.log("File received:", req.data.file);
    
    //         // Step 1: Generate Access Token
    //         console.log("Requesting access token...");
    //         const tokenResponse = await axios.post(
    //             TOKEN_URL,
    //             new URLSearchParams({ grant_type: "client_credentials" }),
    //             {
    //                 auth: { username: CLIENT_ID, password: CLIENT_SECRET }
    //             }
    //         );
    
    //         const accessToken = tokenResponse.data.access_token;
    //         console.log("Access token received:", accessToken);
    
    //         // Step 2: Upload Document to DOX API
    //         console.log("Uploading document to DOX API...");
    //         const fileName = req.data.fileName || "uploaded_document.pdf"; // Default filename
    
    //         const form = new FormData();
    //         form.append('file', Buffer.from(file, 'base64'), { filename: fileName });
    //         form.append('options', JSON.stringify({
    //             "clientId": "default",
    //             "documentType": "Custom",
    //             "schemaName": "Custom_Invoice",
    //             "schemaVersion": "1",
    //             "receivedDate": "2020-02-17",
    //             "enrichment": {}
    //         }));
    
    //         const response = await axios.post(DOX_API_URL, form, {
    //             headers: { ...form.getHeaders(), Authorization: `Bearer ${accessToken}` }
    //         });
    
    //         console.log("Document uploaded successfully, Response:", response.data);
    //         const jobId = response.data.id;
    
    //         // Step 3: Save response to the database
    //         console.log("Saving document details to database...");
    //         await cds.run(INSERT.into(Documents).entries({
    //             ID: cds.utils.uuid(),
    //             name: fileName,
    //             jobId: jobId,
    //             status: "Submitted",
    //             response: JSON.stringify(response.data)
    //         }));
    
    //         console.log("Database entry saved successfully");
    
    //         // Step 4: Directly call getDocumentStatus with jobId
    //         console.log("Fetching document status...");
    //         const result = await getDocumentStatus(jobId, accessToken);
    
    //         return { message: "Document uploaded successfully!", jobId, result };
    
    //     } catch (error) {
    //         console.error("Error in uploadDocument:", error);
    //         req.error(500, "Failed to upload document");
    //     }
    // });
    // async function getDocumentStatus(jobId, accessToken, retries = 3, delay = 5000) {
    //     try {
    //         for (let i = 0; i < retries; i++) {
    //             const response = await axios.get(`${DOX_API_URL}/${jobId}`, {
    //                 headers: { Authorization: `Bearer ${accessToken}` }
    //             });
    
    //             console.log("Document status response:", response.data);
    
    //             // Ensure extraction exists before accessing headerFields & lineItems
    //             if (response.data.extraction) {
    //                 return {
    //                     headerFields: response.data.extraction.headerFields?.map(({ name, value }) => ({ name, value })) || [],
    //                     lineItems: response.data.extraction.lineItems || []
    //                 };
    //             }
    
    //             console.log(`Extraction data not available yet. Retrying in ${delay / 1000} seconds...`);
    //             await new Promise(resolve => setTimeout(resolve, delay));
    //         }
    
    //         throw new Error("Document processing timeout: No extraction data received.");
    //     } catch (error) {
    //         console.error("Error fetching document status:", error);
    //         throw new Error("Failed to retrieve document data");
    //     }
    // }



   
    this.on('uploadDocument', async (req) => {
        try {
            console.log("📂 Upload process started...");
    
            const { file, fileName = "uploaded_document.pdf" } = req.data;
            if (!file) {
                console.error("❌ Error: No file provided");
                return req.error(400, 'File is required');
            }
    
            console.log("🔹 Step 1: Fetching Access Token & Preparing File Upload...");
            const [accessToken, formData] = await Promise.all([
                getAccessToken(),
                prepareFileUpload(file, fileName)
            ]);
    
            console.log("✅ Access Token Retrieved:", accessToken ? "Success" : "Failed");
    
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
            delay *= 1.5; // Exponential Backoff (2s → 3s → 4.5s → ...)
        }
    
        throw new Error("Document processing timeout: No extraction data received.");
    }
    
    
    
    
    
  
    
    


  
    

});
