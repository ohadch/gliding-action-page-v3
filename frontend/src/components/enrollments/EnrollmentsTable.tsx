import {
    Button,
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip
} from "@mui/material";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import {ICourse, IMember, EnrollmentStatus, IEnrollment} from "../../@types";
import {getDisplayNameByEnrollmentStatus} from "../../utils/enrollments.ts";
import {Link} from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import TableViewIcon from "@mui/icons-material/TableView";

export interface EnrollmentsTableProps {
    enrollments: IEnrollment[];
    members: IMember[];
    courses: ICourse[];
    onEnrollmentCreate: () => void;
    onEnrollmentEdit: (enrollment: IEnrollment) => void;
    onEnrollmentDelete: (enrollment: IEnrollment) => void;
    member?: IMember;
}

export default function EnrollmentsTable(props: EnrollmentsTableProps) {
    const {
        member,
        enrollments,
        members,
        courses,
        onEnrollmentCreate,
        onEnrollmentEdit,
        onEnrollmentDelete,
    } = props;

    const getMemberById = (id: number) => members.find((member) => member.id === id);
    const getCourseById = (id: number) => courses.find((course) => course.id === id);

    return (
        <Box>
            <Paper
                sx={{
                    width: '100%',
                    mb: 2,
                }}
            >
                <Toolbar>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => onEnrollmentCreate()}
                    >
                        New Enrollment
                    </Button>
                </Toolbar>
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="enrollments table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Status</TableCell>
                                {member ? null : <TableCell>Member</TableCell>}
                                <TableCell>Course</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {enrollments.map((enrollment) => (
                                <TableRow key={enrollment.id}>
                                    <TableCell component="th" scope="row">
                                        {enrollment.id}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={getDisplayNameByEnrollmentStatus(enrollment.status)}
                                            color={
                                                enrollment.status === EnrollmentStatus.COURSE_IN_PROGRESS
                                                    ? "primary"
                                                    : enrollment.status === EnrollmentStatus.COURSE_COMPLETED
                                                        ? "success"
                                                        : enrollment.status === EnrollmentStatus.CANCELED
                                                            ? "error"
                                                            : "default"
                                            }
                                        />
                                    </TableCell>
                                    {member ? null : (
                                        <TableCell>
                                            <Tooltip
                                                title={"View member"}
                                                placement="top"
                                            >
                                                <Button
                                                    component={Link}
                                                    to={`/members/${enrollment.member_id}`}
                                                    variant="text"
                                                >
                                                    <PersonIcon/>
                                                    {getMemberById(enrollment.member_id)?.name}
                                                </Button>
                                            </Tooltip>
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        <Tooltip
                                            title={"View course"}
                                            placement="top"
                                        >
                                            <Button
                                                component={Link}
                                                to={`/courses/${enrollment.course_id}`}
                                                variant="text"
                                            >
                                                <TableViewIcon/>
                                                {getCourseById(enrollment.course_id)?.name}
                                            </Button>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            color="primary"
                                            onClick={() => onEnrollmentEdit(enrollment)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            color="warning"
                                            onClick={() => onEnrollmentDelete(enrollment)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}
