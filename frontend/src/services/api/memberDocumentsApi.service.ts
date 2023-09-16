import {ModelApi} from "./modelApi.service.ts";
import {IMemberDocument, IMemberDocumentCreate, IMemberDocumentUpdate} from "../../@types/models/MemberDocument";

export class MemberDocumentsApiService extends ModelApi<IMemberDocument, IMemberDocumentCreate, IMemberDocumentUpdate> {
    constructor(memberId: number) {
        super(`/members/${memberId}/documents`);
    }
}
