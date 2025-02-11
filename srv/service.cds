using { managed } from '@sap/cds/common';

service DoxService {
    @odata.draft.enabled
    entity Documents : managed {
        key ID : UUID;
        name : String;
        status : String;
        response : String;
    }

    action uploadDocument(file: Binary) returns String;
    action getDocumentStatus(jobId: String) returns String;
    
}
