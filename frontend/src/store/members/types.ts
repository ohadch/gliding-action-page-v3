import { MemberSchema, MemberRoleSchema } from '../../lib/types';

export interface MembersState {
    members: MemberSchema[];
    roles: MemberRoleSchema[];
    loading: boolean;
    error: string | null;
} 