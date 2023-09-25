import {MemberRoleSchema, MemberSchema, Role} from "../lib/types.ts";

export function hasRole(member: MemberSchema, roles: MemberRoleSchema[], role: Role): boolean {
    return roles.some(memberRole => (memberRole.member_id === member.id) && (memberRole.role === role))
}

export function isCfi(member: MemberSchema, roles: MemberRoleSchema[]): boolean {
    return hasRole(member, roles, "ResponsibleCFI") || hasRole(member, roles, "CFI")
}

export function isFieldResponsible(member: MemberSchema, roles: MemberRoleSchema[]): boolean {
    return hasRole(member, roles, "FieldResponsible")
}

export function isTowPilot(member: MemberSchema, roles: MemberRoleSchema[]): boolean {
    return hasRole(member, roles, "TowPilot")
}

export function isMaintenance(member: MemberSchema, roles: MemberRoleSchema[]): boolean {
    return hasRole(member, roles, "Maintenance")
}

export function isPrivatePilotLicense(member: MemberSchema, roles: MemberRoleSchema[]): boolean {
    return hasRole(member, roles, "PrivatePilotLicense")
}

export function isBeforeSoloStudent(member: MemberSchema, roles: MemberRoleSchema[]): boolean {
    return hasRole(member, roles, "NotCertifiedForSoloPayingStudent") || hasRole(member, roles, "NotCertifiedForSoloNotPayingStudent")
}

export function isSoloStudent(member: MemberSchema, roles: MemberRoleSchema[]): boolean {
    return hasRole(member, roles, "SoloStudent")
}

export function isContact(member: MemberSchema, roles: MemberRoleSchema[]): boolean {
    return hasRole(member, roles, "Contact")
}

export function isObserver(member: MemberSchema, roles: MemberRoleSchema[]): boolean {
    return hasRole(member, roles, "Observer")
}

export function isTester(member: MemberSchema, roles: MemberRoleSchema[]): boolean {
    return hasRole(member, roles, "Tester")
}


export function hasPrivateGliderPilotLicense(member: MemberSchema, roles: MemberRoleSchema[]): boolean {
    return isCfi(member, roles) || isPrivatePilotLicense(member, roles)
}

export function isCertifiedForSinglePilotOperation(member: MemberSchema, roles: MemberRoleSchema[]): boolean {
    return hasPrivateGliderPilotLicense(member, roles) || isSoloStudent(member, roles)
}
