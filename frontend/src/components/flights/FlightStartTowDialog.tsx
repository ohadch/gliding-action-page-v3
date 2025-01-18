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
import { FlightSchema, FlightUpdateSchema } from "../../lib/types";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getMemberDisplayValue } from "../../utils/display";

enum RenderedInputName {
    TOW_AIRPLANE = "TOW_AIRPLANE",
    TOW_PILOT = "TOW_PILOT",
}

export interface FlightStartTowDialogProps {
    flight: FlightSchema;
    open: boolean;
    onCancel: () => void;
    onSubmit: (flight: FlightUpdateSchema) => void;
    fieldResponsibleId?: number;
}

export default function FlightStartTowDialog({
    flight,
    open,
    onCancel,
    onSubmit,
}: FlightStartTowDialogProps) {
    const { t } = useTranslation();
    const membersState = useSelector((state: RootState) => state.members);
    const aircraftState = useSelector((state: RootState) => state.aircraft);
    const { currentDay } = useSelector((state: RootState) => state.actionDays);

    const [towAirplaneId, setTowAirplaneId] = useState<number | null>(flight.tow_airplane_id || null);
    const [towPilotId, setTowPilotId] = useState<number | null>(flight.tow_pilot_id || null);
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

    const getTowPilotByAirplaneId = (airplaneId: number) => {
        const activeTowAirplane = currentDay.activeTowAirplanes?.find(
            (activeTowAirplane) => activeTowAirplane.airplane_id === airplaneId
        );
        return activeTowAirplane?.tow_pilot_id || null;
    };

    const busyTowAirplaneIds = currentDay.flights?.filter(
        (flight) => flight.state === "Tow"
    ).map((flight) => flight.tow_airplane_id) || [];

    const availableTowAirplanes = aircraftState.towAirplanes?.filter((towAirplane) => {
        // Check if airplane is busy
        if (busyTowAirplaneIds.includes(towAirplane.id)) {
            return false;
        }

        // Check if airplane is active
        const isActive = currentDay.activeTowAirplanes?.some(
            (activeTowAirplane) => activeTowAirplane.airplane_id === towAirplane.id
        );
        if (!isActive) {
            return false;
        }

        // Check if tow pilot can't tow themselves
        const towPilotId = getTowPilotByAirplaneId(towAirplane.id);
        const cannotTowThemselves = ![flight.pilot_1_id, flight.pilot_2_id]
            .filter(Boolean)
            .includes(towPilotId);
        
        return cannotTowThemselves;
    }) || [];

    function getInputToRender() {
        if (!towAirplaneId) {
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
                                options={availableTowAirplanes}
                                disabled={availableTowAirplanes.length === 0}
                                value={towAirplaneId ? getTowAirplaneById(towAirplaneId) : null}
                                onChange={(_, newValue) => {
                                    setTowAirplaneId(newValue?.id || null);
                                    setTowPilotId(newValue ? getTowPilotByAirplaneId(newValue.id) : null);
                                }}
                                getOptionLabel={(option) => option.call_sign}
                                open={autocompleteOpen}
                                onOpen={() => setAutocompleteOpen(true)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={t("TOW_AIRPLANE")}
                                        helperText={availableTowAirplanes.length === 0 ? t("NO_TOW_AIRPLANES_AVAILABLE") : undefined}
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
                {towAirplaneId && (
                    <Grid>
                        <strong>{t("TOW_AIRPLANE")}</strong>: {displayTowAirplane(towAirplaneId)}
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
        return Boolean(towAirplaneId) && Boolean(towPilotId);
    };

    return (
        <Dialog open={open} maxWidth="xl">
            <DialogTitle sx={{
                fontSize: "2rem",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between",
                gap: 10
            }}>
                <div>{t("START_TOW")}</div>
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
                        onClick={() => onSubmit({
                            ...flight,
                            tow_airplane_id: towAirplaneId,
                            tow_pilot_id: towPilotId,
                            take_off_at: new Date().toISOString(),
                            state: "Tow",
                        })}
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
