import {ModelApi} from "./modelApi.service.ts";
import {ICourse, ICourseCreate, ICourseUpdate} from "../../@types/models/Course";

class SyllabusesApiService extends ModelApi<ICourse, ICourseCreate, ICourseUpdate> {
    constructor() {
        super("/syllabuses");
    }
}

export const syllabusesApiService = new SyllabusesApiService();
