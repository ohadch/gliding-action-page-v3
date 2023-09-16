import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    FormGroup,
    FormControl
} from "@mui/material";
import React from "react";
import {ICourse} from "../../@types/models/Course";

export interface EditCourseDialogProps {
    open: boolean
    onClose: () => void
    course: ICourse
    onCourseUpdate: (data: ICourse) => void
}

export default function EditCourseDialog(props: EditCourseDialogProps) {
    const {open, onClose, course, onCourseUpdate} = props;

    const [editedCourse, setEditedCourse] = React.useState<ICourse>({
        ...course
    });

    return (
        <Dialog open={open}>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: 400,
                }}
            >
                <FormGroup>
                    <FormControl>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Name"
                            type="text"
                            fullWidth
                            value={editedCourse.name}
                            onChange={(e) => setEditedCourse({
                                ...editedCourse,
                                name: e.target.value
                            })}
                        />
                    </FormControl>
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={
                    () => {
                        onCourseUpdate(editedCourse);
                        onClose();
                    }
                }>Update</Button>
            </DialogActions>
        </Dialog>
    )
}
