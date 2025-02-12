using { managed } from '@sap/cds/common';

service DoxService {
    @odata.draft.enabled
    entity Documents : managed {
        key ID : UUID;
        name : String;
        status : String;
        response : String;
    }
    @odata.draft.enabled
    entity InvoiceDetails:managed {
    key InvoiceNumber   : String(20);
        GrossAmount     : Decimal(10,2);
        InvoiceDate     : Date;
        InvoiceDueDate  : Date;
        SenderCountryCode : String(5);
        BuyerAddress    : String(255);
        BuyerName       : String(100);
        ReceiverPostalCode : String(10);
        SupplierAddress : String(255);
        SupplierName    : String(100);
}

    action uploadDocument(file: Binary , fileName :String) returns String;
    action getDocumentStatus(jobId: String) returns String;
    
}
