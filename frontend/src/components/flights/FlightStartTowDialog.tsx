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
import {useCallback, useEffect, useState} from "react";
import {
    FlightSchema,
    FlightUpdateSchema,
} from "../../lib/types.ts";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../store";
import {fetchMembers, fetchMembersRoles} from "../../store/actions/member.ts";
import {fetchTowAirplanes} from "../../store/actions/towAirplane.ts";
import {
    getMemberDisplayValue,
} from "../../utils/display.ts";
import moment from "moment";

enum RenderedInputName {
    GLIDER = "GLIDER",
    TOW_AIRPLANE = "TOW_AIRPLANE",
    PILOT_1 = "PILOT_1",
    PILOT_2 = "PILOT_2",
    TOW_PILOT = "TOW_PILOT",
    FLIGHT_TYPE = "FLIGHT_TYPE",
}

export interface FlightStartTowDialogProps {
    flight: FlightSchema;
    open: boolean
    onCancel: () => void
    onSubmit: (flight: FlightUpdateSchema) => void
}

export default function FlightStartTowDialog({flight, open, onCancel, onSubmit}: FlightStartTowDialogProps) {
    const dispatch = useAppDispatch();
    const membersStoreState = useSelector((state: RootState) => state.members)
    const glidersStoreState = useSelector((state: RootState) => state.gliders)
    const towAirplanesStoreState = useSelector((state: RootState) => state.towAirplanes)
    const {activeTowAirplanes, flights} = useSelector((state: RootState) => state.currentAction)
    const action = useSelector((state: RootState) => state.actions.actions?.find((action) => action.id === state.currentAction.actionId))

    const {
        t
    } = useTranslation()

    const getMemberById = useCallback((id: number) => membersStoreState.members?.find((member) => member.id === id), [membersStoreState.members]);
    const getGliderById = useCallback((id: number) => glidersStoreState.gliders?.find((glider) => glider.id === id), [glidersStoreState.gliders]);

    const displayMember = (id: number) => {
        const member = getMemberById(id);
        return member ? getMemberDisplayValue(
            member,
        ) : "";
    }

    const displayTowAirplane = (id: number) => {
        const towAirplane = getTowAirplaneById(id);
        return towAirplane ? towAirplane.call_sign : "";
    }

    const getTowAirplaneById = (id: number) => towAirplanesStoreState.towAirplanes?.find((towAirplane) => towAirplane.id === id);

    const getTowPilotByAirplaneId = (airplaneId: number) => {
        const activeTowAirplane = activeTowAirplanes?.find((activeTowAirplane) => activeTowAirplane.airplane_id === airplaneId);
        return activeTowAirplane?.tow_pilot_id || null;
    }


    const busyTowAirplaneIds = flights?.filter((flight) => flight.state === "Tow").map((flight) => flight.tow_airplane_id) || [];
    const availableTowAirplanes = towAirplanesStoreState.towAirplanes?.filter((towAirplane) => {
        if (busyTowAirplaneIds.includes(towAirplane.id)) {
            return false;
        }

        const towPilotId = getTowPilotByAirplaneId(towAirplane.id);

        return ![flight.pilot_1_id, flight.pilot_2_id].filter(Boolean).includes(towPilotId);
    }).filter((towAirplane) => activeTowAirplanes?.find((activeTowAirplane) => activeTowAirplane.airplane_id === towAirplane.id)) || [];

    const [towAirplaneId, setTowAirplaneId] = useState<number | null | undefined>(
        availableTowAirplanes.length === 1 ? availableTowAirplanes[0].id : null
    );
    const towPilotId = useCallback(() => {
        if (!towAirplaneId) {
            return null;
        }

        const activeTowAirplane = activeTowAirplanes?.find((activeTowAirplane) => activeTowAirplane.airplane_id === towAirplaneId);
        return activeTowAirplane?.tow_pilot_id || null;
    }, [towAirplaneId, activeTowAirplanes])();

    const [selfLaunch, setSelfLaunch] = useState<boolean>(false);

    useEffect(() => {
        if (!membersStoreState.members && !membersStoreState.fetchInProgress) {
            dispatch(fetchMembers());
            dispatch(fetchMembersRoles());
        }
    });

    useEffect(() => {
        if (!towAirplanesStoreState.towAirplanes && !towAirplanesStoreState.fetchInProgress) {
            dispatch(fetchTowAirplanes());
        }
    });

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
                                onChange={(_, newValue) => setTowAirplaneId(newValue?.id)}
                                getOptionLabel={(option) => option.call_sign}
                                open={availableTowAirplanes.length > 0}
                                renderInput={(params) => {
                                    return (
                                        <TextField
                                            {...params}
                                            label={t("TOW_AIRPLANE")}
                                        />
                                    )
                                }}
                            />
                        </FormControl>
                    </FormGroup>
                )
            default:
                return null;
        }
    }

    const renderedInputName = getInputToRender();

    function renderFlightPreview() {
        if (selfLaunch) {
            return (
                <Grid>
                    <strong>{t("SELF_LAUNCH")}</strong>
                </Grid>
            )
        }

        return (
            <Grid
                sx={{
                    fontSize: "1.4rem"
                }}
            >
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
        )
    }

    const isSubmitEnabled = () => {
        if (selfLaunch) {
            return true;
        }

        const conditions: boolean[] = [
            Boolean(towAirplaneId),
            Boolean(towPilotId),
        ]

        return conditions.every(Boolean)
    }

    if (!action) {
        return null;
    }

    const isSelfLaunchCapable = flight.glider_id ? getGliderById(flight.glider_id)?.type === "self_launch" : false;


    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Dialog open={open} maxWidth="xl">
            <DialogTitle sx={{
                fontSize: "2rem",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between",
                gap: 10
            }}>
                <div>{t("DISPATCH_FLIGHT")}</div>
                <div style={{
                    display: "flex",
                    gap: 4,
                }}>
                    <Button
                        onClick={onCancel}
                        color={"error"}
                        variant={"contained"}
                        size={"large"}
                        sx={{
                            fontWeight: "bold",
                            fontSize: "1.25rem",
                        }}
                    >
                        {t("CANCEL")}
                    </Button>
                    <Button
                        variant={"contained"}
                        size={"large"}
                        sx={{
                            fontWeight: "bold",
                            fontSize: "1.25rem",
                        }}
                        onClick={() => {
                            if (!confirm(t("CLEAR_CONFIRMATION"))) {
                                return
                            }

                            setTowAirplaneId(null);
                            setSelfLaunch(false);
                        }}>
                        {t("CLEAR")}
                    </Button>
                    <Button
                        color={"success"}
                        variant={"contained"}
                        size={"large"}
                        sx={{
                            fontWeight: "bold",
                            fontSize: "1.25rem",
                        }}
                        disabled={!isSubmitEnabled()}
                        onClick={() => {
                            if (selfLaunch) {
                                return onSubmit({
                                    ...flight,
                                    state: "Inflight",
                                    tow_airplane_id: null,
                                    tow_pilot_id: null,
                                    take_off_at: flight.take_off_at || moment().utcOffset(0, true).set({
                                        date: moment(action?.date).date(),
                                        month: moment(action?.date).month(),
                                        year: moment(action?.date).year(),
                                    }).toISOString(),
                                    tow_type: null
                                })
                            }

                            return onSubmit({
                                ...flight,
                                state: "Tow",
                                tow_airplane_id: towAirplaneId,
                                tow_pilot_id: towPilotId,
                                take_off_at: flight.take_off_at || moment().utcOffset(0, true).set({
                                    date: moment(action?.date).date(),
                                    month: moment(action?.date).month(),
                                    year: moment(action?.date).year(),
                                }).toISOString(),
                                tow_type: null
                            })
                        }}>
                        {t("CONFIRM")}
                    </Button>
                </div>
            </DialogTitle>
            <DialogContent>
                {renderFlightPreview()}
                {!selfLaunch && (
                    <Grid sx={{
                        mt: 2,
                        width: 400,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                    }}>
                        <Grid container alignItems={"center"}>
                            <Grid item xs={
                                isSelfLaunchCapable ? 7 : 12
                            } ml={1}>
                                {renderedInputName && renderInput(renderedInputName)}
                            </Grid>

                            {isSelfLaunchCapable && (
                                <Grid item xs={4}>
                                    <Button
                                        variant={"text"}
                                        onClick={() => setSelfLaunch(true)}
                                        fullWidth
                                    >
                                        {t("SELF_LAUNCH")}?
                                    </Button>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                )}
            </DialogContent>
        </Dialog>
    )
}
