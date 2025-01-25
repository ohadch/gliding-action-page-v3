import {
    Autocomplete,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    FormGroup,
    Grid,
    TextField,
} from "@mui/material";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getMemberDisplayValue } from "../../utils/display";
import { isTowPilot } from "../../utils/members";

enum RenderedInputName {
    TOW_AIRPLANE = "TOW_AIRPLANE",
    TOW_PILOT = "TOW_PILOT",
}

export interface EditActiveTowAirplaneDialogProps {
    towAirplaneId: number;
    open: boolean;
    onCancel: () => void;
    onSubmit: (towPilotId: number) => void;
}

export default function EditActiveTowAirplaneDialog({
    towAirplaneId,
    open,
    onSubmit,
    onCancel
}: EditActiveTowAirplaneDialogProps) {
    const { t } = useTranslation();
    const membersState = useSelector((state: RootState) => state.members);
    const aircraftState = useSelector((state: RootState) => state.aircraft);
    const { currentDay } = useSelector((state: RootState) => state.actionDays);
    const action = useSelector((state: RootState) => 
        state.actionDays.list.actions?.find(
            (action) => action.id === state.actionDays.currentDay.currentActionId
        )
    );

    const [newTowAirplaneId, setNewTowAirplaneId] = useState<number | null>(towAirplaneId);
    const activeTowAirplane = currentDay.activeTowAirplanes?.find(
        (activeTowAirplane) => activeTowAirplane.id === newTowAirplaneId
    );
    const [towPilotId, setTowPilotId] = useState<number | null>(activeTowAirplane?.tow_pilot_id || null);
    const [autocompleteOpen, setAutocompleteOpen] = useState(true);

    const getMemberById = useCallback(
        (id: number) => membersState.members?.find((member) => member.id === id),
        [membersState.members]
    );

    const displayMember = (id: number) => {
        const member = getMemberById(id);
        return member ? getMemberDisplayValue(member) : "";
    };

    const displayTowAirplane = (id: number) => {
        const towAirplane = getTowAirplaneById(id);
        return towAirplane ? towAirplane.call_sign : "";
    };

    const getTowAirplaneById = (id: number) => 
        aircraftState.towAirplanes?.find((towAirplane) => towAirplane.id === id);

    const activeTowPilotIds = currentDay.activeTowAirplanes?.map(
        (activeTowAirplane) => activeTowAirplane.tow_pilot_id
    ) || [];

    const getTowPilotOptions = () => {
        const initialOptions = membersState.members || [];

        const excludedOptions = [
            ...activeTowPilotIds,
            action?.field_responsible_id,
            action?.responsible_cfi_id
        ].filter(Boolean) as number[];

        return initialOptions.filter(member => 
            !excludedOptions.includes(member.id) && 
            isTowPilot(member, membersState.roles || [])
        );
    };

    function getInputToRender() {
        if (!newTowAirplaneId) {
            return RenderedInputName.TOW_AIRPLANE;
        }

        if (!towPilotId) {
            return RenderedInputName.TOW_PILOT;
        }

        return null;
    }

    function renderInput(inputName: RenderedInputName) {
        switch (inputName) {
            case RenderedInputName.TOW_AIRPLANE:
                return (
                    <FormGroup>
                        <FormControl>
                            <Autocomplete
                                id="towAirplane"
                                options={aircraftState.towAirplanes || []}
                                value={newTowAirplaneId ? getTowAirplaneById(newTowAirplaneId) : null}
                                onChange={(_, newValue) => setNewTowAirplaneId(newValue?.id || null)}
                                getOptionLabel={(option) => option.call_sign}
                                open={autocompleteOpen}
                                onOpen={() => setAutocompleteOpen(true)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={t("TOW_AIRPLANE")}
                                    />
                                )}
                            />
                        </FormControl>
                    </FormGroup>
                );
            case RenderedInputName.TOW_PILOT:
                return (
                    <FormGroup>
                        <FormControl>
                            <Autocomplete
                                id="towPilot"
                                options={getTowPilotOptions()}
                                value={towPilotId ? getMemberById(towPilotId) : null}
                                onChange={(_, newValue) => setTowPilotId(newValue?.id || null)}
                                getOptionLabel={(option) => getMemberDisplayValue(option)}
                                open={autocompleteOpen}
                                onOpen={() => setAutocompleteOpen(true)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={t("TOW_PILOT")}
                                    />
                                )}
                            />
                        </FormControl>
                    </FormGroup>
                );
            default:
                return null;
        }
    }

    const renderedInputName = getInputToRender();

    function renderFlightPreview() {
        return (
            <Grid sx={{ fontSize: "1.4rem" }}>
                {newTowAirplaneId && (
                    <Grid>
                        <strong>{t("TOW_AIRPLANE")}</strong>: {displayTowAirplane(newTowAirplaneId)}
                    </Grid>
                )}
                {towPilotId && (
                    <Grid>
                        <strong>{t("TOW_PILOT")}</strong>: {displayMember(towPilotId)}
                    </Grid>
                )}
            </Grid>
        );
    }

    const isSubmitEnabled = () => {
        return Boolean(newTowAirplaneId) && Boolean(towPilotId);
    };

    if (!action) {
        return null;
    }

    return (
        <Dialog open={open} maxWidth="xl">
            <DialogTitle sx={{
                fontSize: "2rem",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between",
                gap: 10
            }}>
                <div>{t("SELECT_TOW_PILOT")}</div>
                <div style={{ display: "flex", gap: 4 }}>
                    <Button
                        color="error"
                        variant="contained"
                        size="large"
                        sx={{
                            fontWeight: "bold",
                            fontSize: "1.25rem",
                        }}
                        onClick={onCancel}
                    >
                        {t("CANCEL")}
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        size="large"
                        sx={{
                            fontWeight: "bold",
                            fontSize: "1.25rem",
                        }}
                        disabled={!isSubmitEnabled()}
                        onClick={() => towPilotId && onSubmit(towPilotId)}
                    >
                        {t("CONFIRM")}
                    </Button>
                </div>
            </DialogTitle>
            <DialogContent>
                {renderFlightPreview()}
                <Grid sx={{
                    mt: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                }}>
                    {renderedInputName && (
                        <Grid sx={{
                            fontSize: "1.4rem",
                            display: "flex",
                            flexDirection: "row",
                            gap: 1,
                        }}>
                            <Grid>
                                <strong>{t(renderedInputName)}: </strong>
                            </Grid>
                            <Grid minWidth={400}>
                                {renderInput(renderedInputName)}
                            </Grid>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>
        </Dialog>
    );
}
