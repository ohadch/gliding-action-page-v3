import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormGroup,
    FormControl, MenuItem, Select, InputLabel
} from "@mui/material";
import React from "react";
import {IEnrollmentCreate, EnrollmentStatus, ICourse, IMember} from "../../@types";
import {getDisplayNameByEnrollmentStatus} from "../../utils/enrollments.ts";

export interface CreateEnrollmentDialogProps {
    open: boolean
    onClose: () => void
    onEnrollmentCreate: (data: IEnrollmentCreate) => void
    courses: ICourse[]
    members: IMember[]
    member?: IMember
}

export default function CreateEnrollmentDialog(props: CreateEnrollmentDialogProps) {
    const {
        members,
        courses,
        open,
        onClose,
        onEnrollmentCreate,
        member
    } = props;

    const [enrolledMember, setEnrolledMember] = React.useState<IMember | null>(
        member || null
    );
    const [course, setCourse] = React.useState<ICourse | null>(null);
    const [enrollmentStatus, setEnrollmentStatus] = React.useState<EnrollmentStatus>(EnrollmentStatus.PENDING);

    return (
        <Dialog open={open}>
            <DialogTitle>Create Enrollment</DialogTitle>
            <DialogContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: 600,
                }}
            >
                <FormGroup
                    style={{
                        paddingTop: 5,
                    }}
                >
                    <FormControl>
                        <InputLabel id="member-label">Member</InputLabel>
                        <Select
                            disabled={!!member}
                            labelId="member-label"
                            id="member"
                            value={enrolledMember?.id || ""}
                            label="Member"
                            onChange={(e) => {
                                const member = props.members.find((member) => member.id === e.target.value);
                                setEnrolledMember(member || null);
                            }}
                        >
                            {members.map((member) => (
                                <MenuItem key={member.id} value={member.id}>{member.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </FormGroup>
                <FormGroup>
                    <FormControl>
                        <InputLabel id="course-label">Course</InputLabel>
                        <Select
                            labelId="course-label"
                            id="course"
                            value={course?.id || ""}
                            label="Course"
                            onChange={(e) => {
                                const course = props.courses.find((course) => course.id === e.target.value);
                                setCourse(course || null);
                            }}
                        >
                            {courses.map((course) => (
                                <MenuItem key={course.id} value={course.id}>{course.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </FormGroup>
                <FormGroup>
                    <FormControl>
                        <InputLabel id="enrollment-status-label">Enrollment Status</InputLabel>
                        <Select
                            labelId="enrollment-status-label"
                            id="enrollment-status"
                            value={enrollmentStatus}
                            label="Enrollment Status"
                            onChange={(e) => setEnrollmentStatus(e.target.value as EnrollmentStatus)}
                        >
                            {Object.values(EnrollmentStatus).map((status) => (
                                <MenuItem key={status} value={status}>
                                    {getDisplayNameByEnrollmentStatus(status)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    disabled={!enrolledMember || !course}
                    onClick={
                        () => {
                            if (!enrolledMember || !course) {
                                return;
                            }

                            onEnrollmentCreate({
                                member_id: enrolledMember.id,
                                course_id: course.id,
                                status: enrollmentStatus,
                            });
                            onClose();
                        }
                    }>Create</Button>
            </DialogActions>
        </Dialog>
    )
}
