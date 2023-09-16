import {useParams} from "react-router-dom";
import {ICourse} from "../../@types";
import {useEffect, useState} from "react";
import CourseSyllabusesContainer
    from "../../components/courseSyllabuses/CourseSyllabusesContainer.tsx";
import {coursesApiService} from "../../services/api/coursesApi.service.ts";

export default function CoursePage() {
    const {id} = useParams();
    const [course, setCourse] = useState<ICourse | null>(null);
    const courseId = parseFloat(id as string)

    useEffect(() => {
        if (!course) {
            coursesApiService.getById(courseId).then((course) => {
                setCourse(course);
            });
        }
    })

    if (!course) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{course.name}</h1>
            <CourseSyllabusesContainer
                course={course}
            />
        </div>
    )
}
