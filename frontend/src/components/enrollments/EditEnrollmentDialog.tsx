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
import {EnrollmentStatus, IEnrollment} from "../../@types";
import {getDisplayNameByEnrollmentStatus} from "../../utils/enrollments.ts";

export interface CreateEnrollmentDialogProps {
    open: boolean
    onClose: () => void
    enrollment: IEnrollment,
    onEnrollmentUpdate: (data: IEnrollment) => void
}

export default function EditEnrollmentDialog(props: CreateEnrollmentDialogProps) {
    const {
        open,
        onClose,
        enrollment,
        onEnrollmentUpdate
    } = props;

    const [editedEnrollment, setEditedEnrollment] = React.useState<IEnrollment>({
        ...enrollment
    })

    return (
        <Dialog open={open}>
            <DialogTitle>Edit Enrollment</DialogTitle>
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
                        <InputLabel id="enrollment-status-label">Enrollment Status</InputLabel>
                        <Select
                            labelId="enrollment-status-label"
                            id="enrollment-status"
                            value={editedEnrollment.status}
                            label="Enrollment Status"
                            onChange={(e) => setEditedEnrollment({
                                ...editedEnrollment,
                                status: e.target.value as EnrollmentStatus
                            })}
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
                    onClick={
                        () => {
                            onEnrollmentUpdate(editedEnrollment);
                            onClose();
                        }
                    }>Update</Button>
            </DialogActions>
        </Dialog>
    )
}
