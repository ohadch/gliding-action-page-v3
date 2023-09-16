import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    FormGroup,
    FormControl, MenuItem, Select, InputLabel
} from "@mui/material";
import React from "react";
import {IMember, MemberStatus} from "../../@types";
import {getDisplayNameByMemberStatus} from "../../utils/members.ts";

export interface EditMemberDialogProps {
    open: boolean
    onClose: () => void
    member: IMember
    onMemberUpdate: (data: IMember) => void
}

export default function EditMemberDialog({open, onClose, member, onMemberUpdate}: EditMemberDialogProps) {
    const [editedMember, setEditedMember] = React.useState<IMember>({
        ...member
    });

    return (
        <Dialog open={open}>
            <DialogTitle>Edit Member</DialogTitle>
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
                            value={editedMember.name}
                            onChange={(e) =>
                                setEditedMember({
                                    ...editedMember,
                                    name: e.target.value
                                })
                            }
                        />
                    </FormControl>
                </FormGroup>
                <FormGroup>
                    <FormControl>
                        <InputLabel id="member-status-label">Member Status</InputLabel>
                        <Select
                            labelId="member-status-label"
                            id="member-status"
                            value={editedMember.status}
                            label="Member Status"
                            onChange={(e) => setEditedMember({
                                ...editedMember,
                                status: e.target.value as MemberStatus
                            })}
                        >
                            {Object.values(MemberStatus).map((status) => (
                                <MenuItem key={status} value={status}>{getDisplayNameByMemberStatus(status)}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={
                    () => {
                        onMemberUpdate(editedMember);
                        onClose();
                    }
                }>Update</Button>
            </DialogActions>
        </Dialog>
    )
}
