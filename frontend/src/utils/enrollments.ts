import {EnrollmentStatus} from "../@types";

export const getDisplayNameByEnrollmentStatus = (enrollmentStatus: EnrollmentStatus) => {
    switch (enrollmentStatus) {
        case EnrollmentStatus.PENDING:
            return "Pending";
        case EnrollmentStatus.COURSE_IN_PROGRESS:
            return "Course in Progress";
        case EnrollmentStatus.COURSE_COMPLETED:
            return "Course Completed";
        case EnrollmentStatus.CANCELED:
            return "Canceled";
    }
}
