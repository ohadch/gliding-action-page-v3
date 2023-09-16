import {Grid} from "@mui/material";
import {useEffect, useState} from "react";
import CourseSyllabusesTable from "./CourseSyllabusesTable.tsx";
import {coursesApiService} from "../../services/api/coursesApi.service.ts";
import {ICourse, ISyllabus} from "../../@types";
import CourseAddSyllabusDialog from "./CourseAddSyllabusDialog.tsx";

export interface CourseSyllabusesContainerProps {
    course: ICourse;
}

export default function CourseSyllabusesContainer(props: CourseSyllabusesContainerProps) {
    const {course} = props;
    const [syllabuses, setSyllabuses] = useState<ISyllabus[] | null>(null);
    const [attachSyllabusDialogOpen, setAttachSyllabusDialogOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!syllabuses) {
            coursesApiService.getSyllabusesByCourseId(
                course.id
            ).then((syllabuses) => {
                setSyllabuses(syllabuses);
            });
        }
    })

    const onSyllabusAdded = (syllabus: ISyllabus) => {
        coursesApiService.addSyllabusToCourse(
            course.id,
            syllabus.id
        ).then(() => {
            setSyllabuses([
                ...(syllabuses || []),
                syllabus
            ])
        })
        .catch((error) => {
            alert(error.message)
        })
    }

    const onSyllabusRemoved = (syllabus: ISyllabus) => {
        if (!confirm(`Are you sure you want to remove syllabus "${syllabus.name}" from course "${course.name}"?`)) {
            return
        }

        coursesApiService.removeSyllabusFromCourse(
            course.id,
            syllabus.id
        ).then(() => {
            setSyllabuses(
                (syllabuses || []).filter((s) => s.id !== syllabus.id)
            )
        })
        .catch((error) => {
            alert(error.message)
        })
    }

    return (
        <>
            <CourseAddSyllabusDialog
                open={attachSyllabusDialogOpen}
                onSyllabusAttach={onSyllabusAdded}
                onClose={() => setAttachSyllabusDialogOpen(false)}
                courseSyllabuses={syllabuses || []}
            />
            <Grid container spacing={2}>
                <CourseSyllabusesTable
                    onOpenAddSyllabusDialog={() => setAttachSyllabusDialogOpen(true)}
                    onSyllabusRemove={onSyllabusRemoved}
                    syllabuses={syllabuses || []}
                />
            </Grid>
        </>
    )
}
