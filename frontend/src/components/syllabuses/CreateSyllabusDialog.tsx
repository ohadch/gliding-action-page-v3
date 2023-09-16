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
import {ISyllabusCreate} from "../../@types/models/Syllabus";

export interface CreateSyllabusDialogProps {
    open: boolean
    onClose: () => void
    onSyllabusCreate: (data: ISyllabusCreate) => void
}

export default function CreateSyllabusDialog({open, onClose, onSyllabusCreate}: CreateSyllabusDialogProps) {
    const [name, setName] = React.useState("");

    return (
        <Dialog open={open}>
            <DialogTitle>Create Syllabus</DialogTitle>
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
                        onSyllabusCreate({
                            name,
                        });
                        onClose();
                    }
                }>Create</Button>
            </DialogActions>
        </Dialog>
    )
}
