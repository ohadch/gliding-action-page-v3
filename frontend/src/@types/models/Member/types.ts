import {MemberStatus} from "./enums.ts";

export interface IMember {
    id: number;
    name: string;
    status: MemberStatus;
}

export interface IMemberCreate {
    name: string;
    status: MemberStatus;
}

export interface IMemberUpdate {
    name: string;
    status: MemberStatus;
}
