import {MemberDocumentStatus} from "./enums.ts";

export interface IMemberDocument {
    id: number;
    member_id: number;
    type_id: number;
    status: MemberDocumentStatus;
    expiration_at: string | null;
}

export interface IMemberDocumentCreate {
    type_id: number;
    status: MemberDocumentStatus;
    expiration_at: string | null;
}

export interface IMemberDocumentUpdate {
    type_id: number;
    status: MemberDocumentStatus;
    expiration_at: string | null;
}
