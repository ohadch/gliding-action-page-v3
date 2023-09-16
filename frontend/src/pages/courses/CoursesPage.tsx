import CoursesTable from "../../components/courses/CoursesTable.tsx";
import {ICourse, ICourseCreate} from "../../@types/models/Course";
import {useEffect, useState} from "react";
import {coursesApiService} from "../../services/api/coursesApi.service.ts";
import CreateCourseDialog from "../../components/courses/CreateCourseDialog.tsx";
import EditCourseDialog from "../../components/courses/EditCourseDialog.tsx";

export default function CoursesPage() {
    const [courses, setCourses] = useState<ICourse[] | null>(null);
    const [createCourseDialogOpen, setCreateCourseDialogOpen] = useState<boolean>(false);
    const [currentlyEditedCourse, setCurrentlyEditedCourse] = useState<ICourse | null>(null);

    useEffect(() => {
        if (!courses) {
            coursesApiService.get().then((courses) => {
                setCourses(courses);
            })
        }
    })

    const createCourse = (data: ICourseCreate) => {
        coursesApiService.create(data).then((course) => {
            setCourses([...(courses || []), course]);
        })
    }

    const updateCourse = (data: ICourse) => {
        coursesApiService.update(data.id, {
            name: data.name,
        }).then((course) => {
            setCourses((courses || []).map((d) => {
                if (d.id === course.id) {
                    return course;
                }

                return d;
            }));
        })
    }

    const deleteCourse = (data: ICourse) => {
        if (!confirm(`Are you sure you want to delete course "${data.name}"?`)) {
            return;
        }

        coursesApiService.delete(data.id).then(() => {
            setCourses((courses || []).filter((d) => {
                return d.id !== data.id;
            }));
        })
    }

    return (
        <>
            <CreateCourseDialog
                open={createCourseDialogOpen}
                onClose={() => setCreateCourseDialogOpen(false)}
                onCourseCreate={createCourse}
            />
            {currentlyEditedCourse && (
                <EditCourseDialog
                    open={!!currentlyEditedCourse}
                    onClose={() => setCurrentlyEditedCourse(null)}
                    course={currentlyEditedCourse}
                    onCourseUpdate={updateCourse}
                />
            )}
            <CoursesTable
                courses={courses || []}
                onCourseCreate={() => setCreateCourseDialogOpen(true)}
                onCourseEdit={(course) => setCurrentlyEditedCourse(course)}
                onCourseDelete={deleteCourse}
            />
        </>
    )
}
