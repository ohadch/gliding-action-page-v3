import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormGroup,
    FormControl, Select, InputLabel, MenuItem
} from "@mui/material";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../store";
import {fetchActions} from "../../store/actions/action.ts";

export interface SelectActionDialogProps {
    open: boolean
    onClose: () => void
    onActionSelected: (actionId: number) => void
    onQuitAction: () => void
}

export default function SelectActionDialog({open, onQuitAction, onClose, onActionSelected}: SelectActionDialogProps) {
    const dispatch = useAppDispatch();
    const { fetchInProgress, actions } = useSelector((state: RootState) => state.actions)
    const { actionId: currentActionId} = useSelector((state: RootState) => state.currentAction)

    const {
        t
    } = useTranslation()

    useEffect(() => {
        if (!actions && !fetchInProgress) {
            dispatch(fetchActions());
        }
    });

    const [actionId, setActionId] = useState<number | undefined>(currentActionId);


    return (
        <Dialog open={open}>
            <DialogTitle>
                {t("SELECT_ACTION")}
            </DialogTitle>
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
                        <InputLabel id="action-label">
                            {t("ACTION")}
                        </InputLabel>
                        <Select
                            labelId="action-label"
                            id="action"
                            value={actionId}
                            label={t("ACTION")}
                            onChange={(e) => {
                                const action = actions?.find((action) => action.id === e.target.value);
                                setActionId(action?.id);
                            }}
                        >
                            {actions?.map((action) => (
                                <MenuItem key={action.id} value={action.id}>{action.date.split("T")[0]}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    {t("CANCEL")}
                </Button>
                <Button onClick={onQuitAction}>
                    {t("QUIT_ACTION")}
                </Button>
                <Button onClick={
                    () => {
                        if (!actionId) {
                            console.warn("No action selected")
                            return;
                        }
                        onActionSelected(actionId);
                        onClose();
                    }
                }>
                    {t("SELECT")}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
