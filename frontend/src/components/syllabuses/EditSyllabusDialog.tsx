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
import {ISyllabus} from "../../@types/models/Syllabus";

export interface EditSyllabusDialogProps {
    open: boolean
    onClose: () => void
    syllabus: ISyllabus
    onSyllabusUpdate: (data: ISyllabus) => void
}

export default function EditSyllabusDialog(props: EditSyllabusDialogProps) {
    const {open, onClose, syllabus, onSyllabusUpdate} = props;

    const [editedSyllabus, setEditedSyllabus] = React.useState<ISyllabus>({
        ...syllabus
    });

    return (
        <Dialog open={open}>
            <DialogTitle>Edit Syllabus</DialogTitle>
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
                            value={editedSyllabus.name}
                            onChange={(e) => setEditedSyllabus({
                                ...editedSyllabus,
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
                        onSyllabusUpdate(editedSyllabus);
                        onClose();
                    }
                }>Update</Button>
            </DialogActions>
        </Dialog>
    )
}
