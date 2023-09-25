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
import {isTowPilot} from "../../utils/members.ts";
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
    const towAirplanesStoreState = useSelector((state: RootState) => state.towAirplanes)
    const {action} = useSelector((state: RootState) => state.currentAction)

    const {
        t
    } = useTranslation()

    const getMemberById = useCallback((id: number) => membersStoreState.members?.find((member) => member.id === id), [membersStoreState.members]);

    const displayMember = (id: number) => {
        const member = getMemberById(id);
        return member ? getMemberDisplayValue(
            member,
            membersStoreState.membersRoles?.filter((role) => role.member_id === member.id) || [],
            true
        ) : "";
    }

    const displayTowAirplane = (id: number) => {
        const towAirplane = getTowAirplaneById(id);
        return towAirplane ? towAirplane.call_sign : "";
    }

    const getTowAirplaneById = (id: number) => towAirplanesStoreState.towAirplanes?.find((towAirplane) => towAirplane.id === id);

    const [towAirplaneId, setTowAirplaneId] = useState<number | null | undefined>();
    const [towPilotId, setTowPilotId] = useState<number | null | undefined>();

    const isMemberBusy = (memberId: number) => {
        const activePilots = [
            flight.pilot_1_id,
            flight.pilot_2_id,
        ].filter(Boolean) as number[];

        return activePilots.includes(memberId);
    }

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

    const [autocompleteOpen, setAutocompleteOpen] = useState(true);

    function getInputToRender() {
        if (!towAirplaneId) {
            return RenderedInputName.TOW_AIRPLANE;
        }

        if (!towPilotId) {
            return RenderedInputName.TOW_PILOT;
        }

        return null;
    }

    const getTowPilotOptions = () => {
        const initialOptions = membersStoreState.members || [];
        return initialOptions.filter((member) => isTowPilot(member, membersStoreState.membersRoles || []));
    }

    function renderInput(inputName: RenderedInputName) {
        switch (inputName) {
            case RenderedInputName.TOW_AIRPLANE:
                return (
                    <FormGroup>
                        <FormControl>
                            <Autocomplete
                                id="towAirplane"
                                options={towAirplanesStoreState.towAirplanes || []}
                                value={towAirplaneId ? getTowAirplaneById(towAirplaneId) : null}
                                onChange={(_, newValue) => setTowAirplaneId(newValue?.id)}
                                getOptionLabel={(option) => option.call_sign}
                                open={autocompleteOpen}
                                onOpen={() => setAutocompleteOpen(true)}
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
            case RenderedInputName.TOW_PILOT:
                return (
                    <FormGroup>
                        <FormControl>
                            <Autocomplete
                                id="towPilot"
                                options={getTowPilotOptions().filter((member) => !isMemberBusy(member.id))}
                                value={towPilotId ? getMemberById(towPilotId) : null}
                                onChange={(_, newValue) => setTowPilotId(newValue?.id)}
                                getOptionLabel={(option) => getMemberDisplayValue(
                                    option
                                )}
                                open={autocompleteOpen}
                                onOpen={() => setAutocompleteOpen(true)}
                                renderInput={(params) => {
                                    return (
                                        <TextField
                                            {...params}
                                            label={t("TOW_PILOT")}
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
        return (
            <Grid>
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
        const conditions: boolean[] = [
            Boolean(towAirplaneId),
            Boolean(towPilotId),
        ]

        return conditions.every(Boolean)
    }

    if (!action) {
        return null;
    }

    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Dialog open={open} maxWidth="xl">
            <DialogTitle sx={{
                display: "flex",
                justifyContent: "space-between",
            }}>
                <div>{t("CREATE_FLIGHT")}</div>
                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                }}>
                    <Button onClick={onCancel}>
                        {t("CANCEL")}
                    </Button>
                    <Button onClick={() => {
                        if (!confirm(t("CLEAR_CONFIRMATION"))) {
                            return
                        }

                        setTowAirplaneId(null);
                        setTowPilotId(null);
                    }}>
                        {t("CLEAR")}
                    </Button>
                    <Button
                        disabled={!isSubmitEnabled()}
                        onClick={() => onSubmit({
                            ...flight,
                            state: "Tow",
                            tow_airplane_id: towAirplaneId,
                            tow_pilot_id: towPilotId,
                            take_off_at: flight.take_off_at || moment().utcOffset(0, true).toISOString(),
                            tow_type: null
                        })}>
                        {t("CONFIRM")}
                    </Button>
                </div>
            </DialogTitle>
            <DialogContent>
                {renderFlightPreview()}
                <Grid sx={{
                    mt: 2,
                    width: 400,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                }}>
                    {renderedInputName && renderInput(renderedInputName)}
                </Grid>
            </DialogContent>
        </Dialog>
    )
}
