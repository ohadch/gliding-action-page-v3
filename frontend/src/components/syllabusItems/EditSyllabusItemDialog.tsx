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
import {
    ISyllabusItem,
} from "../../@types";

export interface EditSyllabusItemDialogProps {
    open: boolean
    onClose: () => void
    syllabusItem: ISyllabusItem,
    onSyllabusItemUpdate: (data: ISyllabusItem) => void
}

export default function EditSyllabusItemDialog(props: EditSyllabusItemDialogProps) {
    const {open, onClose, syllabusItem, onSyllabusItemUpdate} = props
    const [editedSyllabusItem, setEditedSyllabusItem] = React.useState<ISyllabusItem>({
        ...syllabusItem
    })

    return (
        <Dialog open={open}>
            <DialogTitle>Edit Syllabus Item</DialogTitle>
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
                            value={editedSyllabusItem.name}
                            onChange={(e) => setEditedSyllabusItem({
                                ...editedSyllabusItem,
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
                        onSyllabusItemUpdate(editedSyllabusItem);
                        onClose();
                    }
                }>Update</Button>
            </DialogActions>
        </Dialog>
    )
}
