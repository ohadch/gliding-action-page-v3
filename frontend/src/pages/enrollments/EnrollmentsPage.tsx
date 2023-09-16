import EnrollmentsTable from "../../components/enrollments/EnrollmentsTable.tsx";
import {useEffect, useState} from "react";
import {enrollmentsApiService} from "../../services/api/enrollmentsApi.service.ts";
import {membersApiService} from "../../services/api";
import {coursesApiService} from "../../services/api/coursesApi.service.ts";
import CreateEnrollmentDialog from "../../components/enrollments/CreateEnrollmentDialog.tsx";
import {IEnrollment, IEnrollmentCreate, ICourse, IMember} from "../../@types";
import EditEnrollmentDialog from "../../components/enrollments/EditEnrollmentDialog.tsx";

export default function EnrollmentsPage() {
    const [enrollments, setEnrollments] = useState<IEnrollment[] | null>(null);
    const [members, setMembers] = useState<IMember[] | null>(null);
    const [courses, setCourses] = useState<ICourse[] | null>(null);
    const [createEnrollmentDialogOpen, setCreateEnrollmentDialogOpen] = useState<boolean>(false);
    const [currentlyEditedEnrollment, setCurrentlyEditedEnrollment] = useState<IEnrollment | null>(null);

    useEffect(() => {
        if (!enrollments) {
            enrollmentsApiService.get().then((enrollments) => {
                setEnrollments(enrollments);
            })
        }

        if (!members) {
            membersApiService.get().then((members) => {
                setMembers(members);
            })
        }

        if (!courses) {
            coursesApiService.get().then((courses) => {
                setCourses(courses);
            })
        }
    })

    const createEnrollment = (data: IEnrollmentCreate) => {
        enrollmentsApiService.create(data).then((enrollment) => {
            setEnrollments([...(enrollments || []), enrollment]);
        })
    }

    const updateEnrollment = (data: IEnrollment) => {
        enrollmentsApiService.update(data.id, data)
            .then((enrollment) => {
                setEnrollments((enrollments || []).map((d) => {
                    if (d.id === enrollment.id) {
                        return enrollment;
                    }

                    return d;
                }));
            })
    }

    const deleteEnrollment = (data: IEnrollment) => {
        const member = members?.find((member) => member.id === data.member_id);
        const course = courses?.find((course) => course.id === data.course_id);

        if (!confirm(`Are you sure you want to delete the enrollment for ${member?.name} in ${course?.name}?`)) {
            return;
        }

        enrollmentsApiService.delete(data.id).then(() => {
            setEnrollments((enrollments || []).filter((d) => {
                return d.id !== data.id;
            }));
        })
    }

    return (
        <>
            <CreateEnrollmentDialog
                open={createEnrollmentDialogOpen}
                onClose={() => setCreateEnrollmentDialogOpen(false)}
                onEnrollmentCreate={createEnrollment}
                courses={courses || []}
                members={members || []}
            />
            {currentlyEditedEnrollment && (
                <EditEnrollmentDialog
                    open={!!currentlyEditedEnrollment}
                    onClose={() => setCurrentlyEditedEnrollment(null)}
                    onEnrollmentUpdate={updateEnrollment}
                    enrollment={currentlyEditedEnrollment}
                />
            )}
            <EnrollmentsTable
                enrollments={enrollments || []}
                members={members || []}
                courses={courses || []}
                onEnrollmentCreate={() => setCreateEnrollmentDialogOpen(true)}
                onEnrollmentEdit={(enrollment) => setCurrentlyEditedEnrollment(enrollment)}
                onEnrollmentDelete={deleteEnrollment}
            />
        </>
    )
}
