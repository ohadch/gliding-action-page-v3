import {useParams} from "react-router-dom";
import {ICourse, IEnrollment, IEnrollmentCreate, IMember} from "../../@types";
import {useEffect, useState} from "react";
import {coursesApiService, enrollmentsApiService, membersApiService} from "../../services/api";
import MemberDocumentsContainer from "../../components/memberDocuments/MemberDocumentsContainer.tsx";
import {Grid} from "@mui/material";
import CreateEnrollmentDialog from "../../components/enrollments/CreateEnrollmentDialog.tsx";
import EnrollmentsTable from "../../components/enrollments/EnrollmentsTable.tsx";
import EditEnrollmentDialog from "../../components/enrollments/EditEnrollmentDialog.tsx";

export default function MemberPage() {
    const {id} = useParams();
    const [member, setMember] = useState<IMember | null>(null);
    const [enrollments, setEnrollments] = useState<IEnrollment[] | null>(null);
    const [courses, setCourses] = useState<ICourse[] | null>(null);
    const memberId = parseFloat(id as string)
    const [createEnrollmentDialogOpen, setCreateEnrollmentDialogOpen] = useState<boolean>(false);
    const [currentlyEditedEnrollment, setCurrentlyEditedEnrollment] = useState<IEnrollment | null>(null);

    useEffect(() => {
        if (!member) {
            membersApiService.getById(memberId).then((member) => {
                setMember(member);
            });
        }

        if (!courses) {
            coursesApiService.get().then((courses) => {
                setCourses(courses);
            })
        }

        if (!enrollments) {
            enrollmentsApiService.get({
                member_id: memberId
            }).then((enrollments) => {
                setEnrollments(enrollments);
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

    if (!member) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <CreateEnrollmentDialog
                open={createEnrollmentDialogOpen}
                onClose={() => setCreateEnrollmentDialogOpen(false)}
                members={[member]}
                member={member}
                courses={courses || []}
                onEnrollmentCreate={createEnrollment}
            />
            {currentlyEditedEnrollment && (
                <EditEnrollmentDialog
                    open={!!currentlyEditedEnrollment}
                    onClose={() => setCurrentlyEditedEnrollment(null)}
                    onEnrollmentUpdate={updateEnrollment}
                    enrollment={currentlyEditedEnrollment}
                />
            )}
            <Grid container>
                <Grid item xs={12}>
                    <h1>{member.name}</h1>
                </Grid>
                <Grid item xs={12}>
                    <h2>Enrollments</h2>
                    <EnrollmentsTable
                        enrollments={enrollments || []}
                        courses={courses || []}
                        member={member}
                        members={[]}
                        onEnrollmentCreate={() => setCreateEnrollmentDialogOpen(true)}
                        onEnrollmentEdit={(enrollment) => setCurrentlyEditedEnrollment(enrollment)}
                        onEnrollmentDelete={deleteEnrollment}
                    />
                </Grid>
                <Grid item xs={12}>
                    <h2>Documents</h2>
                    <MemberDocumentsContainer member={member}/>
                </Grid>
            </Grid>
        </>
    )
}
