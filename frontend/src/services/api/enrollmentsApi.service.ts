import {ModelApi} from "./modelApi.service.ts";
import {IEnrollment, IEnrollmentCreate, IEnrollmentUpdate} from "../../@types";

class EnrollmentsApiService extends ModelApi<IEnrollment, IEnrollmentCreate, IEnrollmentUpdate> {
    constructor() {
        super("/enrollments");
    }
}

export const enrollmentsApiService = new EnrollmentsApiService();
