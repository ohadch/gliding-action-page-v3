import { MemberSchema, MemberRoleSchema } from "../../lib/types";
import { BaseInitialState } from "./base";

export interface MembersStoreState extends BaseInitialState {
    members?: MemberSchema[];
    roles?: MemberRoleSchema[];
} 