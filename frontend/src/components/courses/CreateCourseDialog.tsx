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
import {ICourseCreate} from "../../@types/models/Course";

export interface CreateCourseDialogProps {
    open: boolean
    onClose: () => void
    onCourseCreate: (data: ICourseCreate) => void
}

export default function CreateCourseDialog({open, onClose, onCourseCreate}: CreateCourseDialogProps) {
    const [name, setName] = React.useState("");

    return (
        <Dialog open={open}>
            <DialogTitle>Create Course</DialogTitle>
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
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </FormControl>
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={
                    () => {
                        onCourseCreate({
                            name,
                        });
                        onClose();
                    }
                }>Create</Button>
            </DialogActions>
        </Dialog>
    )
}
