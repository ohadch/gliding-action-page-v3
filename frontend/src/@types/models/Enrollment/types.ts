import {EnrollmentStatus} from "./enums.ts";

export interface IEnrollment {
    id: number;
    member_id: number;
    course_id: number;
    status: EnrollmentStatus;
}

export interface IEnrollmentCreate {
    member_id: number;
    course_id: number;
    status: EnrollmentStatus;
}

export interface IEnrollmentUpdate {
    member_id: number;
    course_id: number;
    status: EnrollmentStatus;
}
