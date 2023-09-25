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
import {ActionSchema} from "../../lib/types.ts";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../store";
import {fetchActions} from "../../store/actions/action.ts";

export interface SelectActionDialogProps {
    open: boolean
    onClose: () => void
    onActionSelected: (action: ActionSchema) => void
}

export default function SelectActionDialog({open, onClose, onActionSelected}: SelectActionDialogProps) {
    const dispatch = useAppDispatch();
    const { fetchInProgress, actions } = useSelector((state: RootState) => state.actions)
    const currentAction = useSelector((state: RootState) => state.actions.actions?.find((action) => action.id === state.currentAction.actionId))

    const {
        t
    } = useTranslation()

    useEffect(() => {
        if (!actions && !fetchInProgress) {
            dispatch(fetchActions());
        }
    });

    const [action, setAction] = useState<ActionSchema | undefined>(
        currentAction
    );


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
                            value={action?.id || ""}
                            label={t("ACTION")}
                            onChange={(e) => {
                                const action = actions?.find((action) => action.id === e.target.value);
                                setAction(action);
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
                <Button onClick={
                    () => {
                        if (!action) {
                            console.warn("No action selected")
                            return;
                        }
                        onActionSelected(action);
                        onClose();
                    }
                }>
                    {t("SELECT")}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
