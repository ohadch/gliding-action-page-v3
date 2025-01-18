import { RootState } from '../index';
import { Role, MemberSchema } from '../../lib/types';
import { createSelector } from '@reduxjs/toolkit';

// Base selectors
const selectMembers = (state: RootState) => state.members.members;
const selectRoles = (state: RootState) => state.members.roles;

// Base role checker
export const hasRole = (state: RootState, memberId: number, role: Role): boolean => {
    return state.members.roles.some(
        memberRole => memberRole.member_id === memberId && memberRole.role === role
    );
};

// Memoized role-specific selectors
export const getInstructors = createSelector(
    [selectMembers, selectRoles],
    (members, roles): MemberSchema[] => {
        return members.filter(member => {
            // Check if member has any instructor roles
            return roles.some(role =>
                role.member_id === member.id && 
                ["ResponsibleCFI", "CFI"].includes(role.role)
            );
        });
    }
);

export const getFieldResponsibles = createSelector(
    [selectMembers, selectRoles],
    (members, roles): MemberSchema[] => {
        return members.filter(member => {
            // Check if member has field responsible role
            return roles.some(role => 
                role.member_id === member.id && 
                role.role === "FieldResponsible"
            );
        });
    }
);

export const getTowPilots = createSelector(
    [selectMembers, selectRoles],
    (members, roles): MemberSchema[] => {
        const towPilots = members.filter(member =>
            roles.some(memberRole => {
                return memberRole.member_id === member.id && memberRole.role === "TowPilot";
            })
        );

        return towPilots;
    }
);

export const getSoloStudents = createSelector(
    [selectMembers, selectRoles],
    (members, roles): MemberSchema[] => {
        return members.filter(member => 
            roles.some(role => 
                role.member_id === member.id && 
                role.role === "SoloStudent"
            )
        );
    }
);

// Individual role checks (these don't need memoization as they return primitives)
export const isInstructor = (state: RootState, memberId: number): boolean => {
    return hasRole(state, memberId, "CFI") || hasRole(state, memberId, "ResponsibleCFI");
};

export const isFieldResponsible = (state: RootState, memberId: number): boolean => {
    return hasRole(state, memberId, "FieldResponsible");
};

export const isTowPilot = (state: RootState, memberId: number): boolean => {
    return hasRole(state, memberId, "TowPilot");
};

export const isMaintenance = (state: RootState, memberId: number): boolean => {
    return hasRole(state, memberId, "Maintenance");
};

export const isPrivatePilotLicense = (state: RootState, memberId: number): boolean => {
    return hasRole(state, memberId, "PrivatePilotLicense");
};

export const isBeforeSoloStudent = (state: RootState, memberId: number): boolean => {
    return hasRole(state, memberId, "NotCertifiedForSoloPayingStudent") || 
           hasRole(state, memberId, "NotCertifiedForSoloNotPayingStudent");
};

export const isSoloStudent = (state: RootState, memberId: number): boolean => {
    return hasRole(state, memberId, "SoloStudent");
};

export const isContact = (state: RootState, memberId: number): boolean => {
    return hasRole(state, memberId, "Contact");
};

export const isObserver = (state: RootState, memberId: number): boolean => {
    return hasRole(state, memberId, "Observer");
};

export const isTester = (state: RootState, memberId: number): boolean => {
    return hasRole(state, memberId, "Tester");
};

// Composite role checks
export const hasPrivateGliderPilotLicense = (state: RootState, memberId: number): boolean => {
    return isInstructor(state, memberId) || isPrivatePilotLicense(state, memberId);
};

export const isCertifiedForSinglePilotOperation = (state: RootState, memberId: number): boolean => {
    return hasPrivateGliderPilotLicense(state, memberId) || isSoloStudent(state, memberId);
}; 