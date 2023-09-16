import {ModelApi} from "./modelApi.service.ts";
import axios from "axios";
import {ICourse, ICourseCreate, ICourseUpdate, ISyllabus} from "../../@types";

class CoursesApiService extends ModelApi<ICourse, ICourseCreate, ICourseUpdate> {
    constructor() {
        super("/courses");
    }

    async getSyllabusesByCourseId(id: number): Promise<ISyllabus[]> {
        const response = await axios.get<ISyllabus[]>(`${this.API_URL}${this.endpoint}/${id}/syllabuses`);
        return response.data;
    }

    async addSyllabusToCourse(id: number, syllabusId: number): Promise<ISyllabus[]> {
        const response = await axios.post<ISyllabus[]>(
            `${this.API_URL}${this.endpoint}/${id}/syllabuses?syllabus_id=${syllabusId}`,
        );
        return response.data;
    }

    async removeSyllabusFromCourse(id: number, syllabusId: number): Promise<ISyllabus[]> {
        const response = await axios.delete<ISyllabus[]>(
            `${this.API_URL}${this.endpoint}/${id}/syllabuses?syllabus_id=${syllabusId}`,
        );
        return response.data;
    }
}

export const coursesApiService = new CoursesApiService();
