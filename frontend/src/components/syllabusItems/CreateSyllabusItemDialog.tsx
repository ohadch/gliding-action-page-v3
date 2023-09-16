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
import {ISyllabus, ISyllabusItemCreate} from "../../@types";

export interface CreateSyllabusItemDialogProps {
    open: boolean
    onClose: () => void
    onSyllabusItemCreate: (data: ISyllabusItemCreate) => void
    syllabus: ISyllabus
}

export default function CreateSyllabusItemDialog(props: CreateSyllabusItemDialogProps) {
    const {open, onClose, onSyllabusItemCreate, syllabus} = props;
    const [name, setName] = React.useState("");

    return (
        <Dialog open={open}>
            <DialogTitle>Create Syllabus Item</DialogTitle>
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
                        onSyllabusItemCreate({
                            name,
                            syllabus_id: syllabus.id,
                        });
                        onClose();
                    }
                }>Create</Button>
            </DialogActions>
        </Dialog>
    )
}
