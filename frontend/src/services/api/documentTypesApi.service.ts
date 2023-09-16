import {ModelApi} from "./modelApi.service.ts";
import {IDocumentType, IDocumentTypeCreate, IDocumentTypeUpdate} from "../../@types/models/DocumentType";

class DocumentTypesApiService extends ModelApi<IDocumentType, IDocumentTypeCreate, IDocumentTypeUpdate> {
    constructor() {
        super("/document_types");
    }
}

export const documentTypesApiService = new DocumentTypesApiService();
