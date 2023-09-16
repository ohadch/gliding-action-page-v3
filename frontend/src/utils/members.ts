import {MemberStatus} from "../@types";

export const getDisplayNameByMemberStatus = (memberStatus: MemberStatus) => {
    switch (memberStatus) {
        case MemberStatus.BEFORE_SOLO_STUDENT:
            return "Before Solo Student";
        case MemberStatus.SOLO_STUDENT:
            return "Solo Student";
        case MemberStatus.PRIVATE_PILOT:
            return "Private Pilot";
        case MemberStatus.CFI:
            return "CFI";
    }
}
