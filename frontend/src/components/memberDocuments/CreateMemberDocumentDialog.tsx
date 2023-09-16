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
import React, {useEffect} from "react";
import {IDocumentType, IMemberDocumentCreate, MemberDocumentStatus} from "../../@types";
import {documentTypesApiService} from "../../services/api/documentTypesApi.service.ts";

export interface CreateMemberDocumentDialogProps {
    open: boolean
    onClose: () => void
    onMemberDocumentCreate: (data: IMemberDocumentCreate) => void
}

export default function CreateMemberDocumentDialog(props: CreateMemberDocumentDialogProps) {
    const {
        open,
        onClose,
        onMemberDocumentCreate
    } = props;

    const [documentType, setDocumentType] = React.useState<IDocumentType | null>(null);
    const [expirationAt, setExpirationAt] = React.useState<Date>(new Date());
    const [documentStatus, setDocumentStatus] = React.useState<MemberDocumentStatus>(MemberDocumentStatus.PENDING);
    const [allDocumentTypes, setAllDocumentTypes] = React.useState<IDocumentType[] | null>(null);

    useEffect(() => {
        if (allDocumentTypes) {
            return;
        }
        documentTypesApiService.get()
            .then((documentTypes) => {
                console.log({documentTypes})
                setAllDocumentTypes(documentTypes);
            })
            .catch((err) => {
                alert(err);
            })
    })

    return (
        <Dialog open={open}>
            <DialogTitle>Create Member Document</DialogTitle>
            <DialogContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: 400,
                }}
            >
                <FormGroup
                    style={{
                        paddingTop: 5,
                    }}
                >
                    <FormControl>
                        <InputLabel id="member-document-type-label">Document Type</InputLabel>
                        <Select
                            labelId="document-type-label"
                            id="document-type"
                            value={documentType?.id || ""}
                            label="Document Type"
                            onChange={(e) => {
                                const documentTypeId = e.target.value as number;
                                const documentType = (allDocumentTypes || [])
                                    .find((documentType) => documentType.id === documentTypeId);
                                setDocumentType(documentType || null);
                            }}
                        >
                            {allDocumentTypes && allDocumentTypes.map((documentType) => (
                                <MenuItem key={documentType.id} value={documentType.id}>{documentType.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </FormGroup>
                <FormGroup>
                    <FormControl>
                        <InputLabel id="member-document-status-label">Document Status</InputLabel>
                        <Select
                            labelId="member-document-status-label"
                            id="member-document-status"
                            value={documentStatus}
                            label="Document Status"
                            onChange={(e) => setDocumentStatus(e.target.value as MemberDocumentStatus)}
                        >
                            {Object.values(MemberDocumentStatus).map((status) => (
                                <MenuItem key={status} value={status}>{status}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </FormGroup>
                <FormGroup>
                    <TextField
                        label="Expiration Date"
                        type="date"
                        value={expirationAt.toISOString().split("T")[0]}
                        onChange={(e) => setExpirationAt(new Date(e.target.value))}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    disabled={!documentType}
                    onClick={
                        () => {
                            if (!documentType) {
                                return;
                            }

                            onMemberDocumentCreate({
                                type_id: documentType.id,
                                expiration_at: expirationAt.toISOString(),
                                status: documentStatus,
                            });
                            onClose();
                        }
                    }>Create</Button>
            </DialogActions>
        </Dialog>
    )
}
