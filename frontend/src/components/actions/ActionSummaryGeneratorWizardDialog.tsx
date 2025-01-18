import {
    Autocomplete,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    FormGroup,
    Grid, InputLabel, MenuItem, Select,
    TextField,
} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import {FlightSchema, GliderSchema} from "../../lib/types.ts";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../store";
import {fetchMembers, fetchMembersRoles} from "../../store/actions/member.ts";
import {fetchGliderOwners, fetchGliders} from "../../store/actions/glider.ts";
import {fetchTowAirplanes} from "../../store/actions/towAirplane.ts";
import {
    getGliderDisplayValue,
    getMemberDisplayValue,
} from "../../utils/display.ts";
import Duration from "../common/Duration.tsx";
import FlightsTable from "../flights/FlightsTable.tsx";
import FlightsTableSendEmailDialog from "../flights/FlightsTableSendEmailDialog.tsx";

enum RenderedInputName {
    REPORT_TYPE = "REPORT_TYPE",
    GLIDER_PILOT = "GLIDER_PILOT",
    GLIDER = "GLIDER",
    TOW_PILOT = "TOW_PILOT",
    TOW_AIRPLANE = "TOW_AIRPLANE",
}

enum ReportType {
    GLIDER_PILOT = "GLIDER_PILOT",
    GLIDER = "GLIDER",
    TOW_PILOT = "TOW_PILOT",
    TOW_AIRPLANE = "TOW_AIRPLANE",
}

export interface ActionSummaryGeneratorWizardDialogProps {
    open: boolean
    onClose: () => void
}

export default function ActionSummaryGeneratorWizardDialog({
                                                               open,
                                                               onClose,
                                                           }: ActionSummaryGeneratorWizardDialogProps) {
    const dispatch = useAppDispatch();
    const membersStoreState = useSelector((state: RootState) => state.members)
    const glidersStoreState = useSelector((state: RootState) => state.gliders)
    const towAirplanesStoreState = useSelector((state: RootState) => state.towAirplanes)
    const action = useSelector((state: RootState) => state.actionDays.actions?.find((action) => action.id === state.actionDays.actionId))
    const currentActionStoreState = useSelector((state: RootState) => state.actionDays)
    const [reportType, setReportType] = useState<ReportType | null>(null);
    const [sendEmailDialogOpen, setSendEmailDialogOpen] = useState(false);

    const {
        t
    } = useTranslation()

    const getMemberById = useCallback((id: number) => membersStoreState.members?.find((member) => member.id === id), [membersStoreState.members]);
    const getGliderById = useCallback((id: number) => glidersStoreState.gliders?.find((glider) => glider.id === id), [glidersStoreState.gliders]);
    const displayGlider = (id: number) => {
        const glider = getGliderById(id);
        return glider ? getGliderDisplayValue(
            glider,
            glidersStoreState.ownerships?.filter((ownership) => ownership.glider_id === id) || [],
            true
        ) : "";
    }

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

    const [gliderId, setGliderId] = useState<number | null | undefined>();
    const [gliderPilotId, setGliderPilotId] = useState<number | null | undefined>();
    const [towAirplaneId, setTowAirplaneId] = useState<number | null | undefined>();
    const [towPilotId, setTowPilotId] = useState<number | null | undefined>();

    useEffect(() => {
        if (!membersStoreState.members && !membersStoreState.fetchInProgress) {
            dispatch(fetchMembers());
            dispatch(fetchMembersRoles());
        }
    });

    useEffect(() => {
        if (!glidersStoreState.gliders && !glidersStoreState.fetchInProgress) {
            dispatch(fetchGliders());
            dispatch(fetchGliderOwners());
        }
    });

    useEffect(() => {
        if (!towAirplanesStoreState.towAirplanes && !towAirplanesStoreState.fetchInProgress) {
            dispatch(fetchTowAirplanes());
        }
    });

    const [autocompleteOpen, setAutocompleteOpen] = useState(true);

    function getInputToRender() {
        if (!reportType) {
            return RenderedInputName.REPORT_TYPE;
        }

        switch (reportType) {
            case ReportType.GLIDER_PILOT:
                if (gliderPilotId) {
                    break
                }

                return RenderedInputName.GLIDER_PILOT;
            case ReportType.GLIDER:
                if (gliderId) {
                    break
                }

                return RenderedInputName.GLIDER;
            case ReportType.TOW_PILOT:
                if (towPilotId) {
                    break
                }

                return RenderedInputName.TOW_PILOT;
            case ReportType.TOW_AIRPLANE:
                if (towAirplaneId) {
                    break
                }

                return RenderedInputName.TOW_AIRPLANE;
            default:
                return null;
        }
    }

    const getGliderPilots = () => {
        const initialOptions = membersStoreState.members || [];

        const pilot1sInAction = currentActionStoreState.flights
            ?.filter((flight) => flight.pilot_1_id)
            .filter((flight) => flight.state !== "Draft")
            .map((flight) => flight.pilot_1_id)
            .filter(Boolean) || [] as number[];

        const pilot2sInAction = currentActionStoreState.flights
            ?.filter((flight) => flight.pilot_2_id)
            .filter((flight) => flight.state !== "Draft")
            .map((flight) => flight.pilot_2_id)
            .filter(Boolean) || [] as number[];

        const gliderPilotsInAction = [
            ...new Set([
                ...pilot1sInAction,
                ...pilot2sInAction,
            ])
        ]

        return initialOptions.filter((member) => gliderPilotsInAction.some((pilotId) => pilotId === member.id));
    }

    const getTowPilots = () => {
        const initialOptions = membersStoreState.members || [];

        const towPilotsInAction = currentActionStoreState.flights
            ?.filter((flight) => flight.tow_pilot_id)
            .filter((flight) => flight.state !== "Draft")
            .map((flight) => flight.tow_pilot_id)
            .filter(Boolean) || [] as number[];

        return initialOptions.filter((member) => towPilotsInAction.some((pilotId) => pilotId === member.id));
    }

    const getGliders = () => {
        const initialOptions = glidersStoreState.gliders || [];

        const glidersInAction = currentActionStoreState.flights
            ?.filter((flight) => flight.glider_id)
            .filter((flight) => flight.state !== "Draft")
            .map((flight) => flight.glider_id)
            .filter(Boolean) || [] as number[];

        return initialOptions.filter((glider) => glidersInAction.some((gliderId) => gliderId === glider.id));
    }

    const getTowAirplanes = () => {
        const initialOptions = towAirplanesStoreState.towAirplanes || [];

        const towAirplanesInAction = currentActionStoreState.flights
            ?.filter((flight) => flight.tow_airplane_id)
            .filter((flight) => flight.state !== "Draft")
            .map((flight) => flight.tow_airplane_id)
            .filter(Boolean) || [] as number[];

        return initialOptions.filter((towAirplane) => towAirplanesInAction.some((towAirplaneId) => towAirplaneId === towAirplane.id));
    }

    function renderInput(inputName: RenderedInputName) {
        switch (inputName) {
            case RenderedInputName.REPORT_TYPE:
                return (
                    <FormGroup>
                        <FormControl>
                            <InputLabel id="reportType">{t("REPORT_TYPE")}</InputLabel>
                            <Select
                                id="reportType"
                                value={reportType}
                                onChange={(event) => setReportType(event.target.value as ReportType)}
                                label={t("REPORT_TYPE")}
                            >
                                <MenuItem value={ReportType.GLIDER_PILOT}>{t("GLIDER_PILOT")}</MenuItem>
                                <MenuItem value={ReportType.GLIDER}>{t("GLIDER")}</MenuItem>
                                <MenuItem value={ReportType.TOW_PILOT}>{t("TOW_PILOT")}</MenuItem>
                                <MenuItem value={ReportType.TOW_AIRPLANE}>{t("TOW_AIRPLANE")}</MenuItem>
                            </Select>
                        </FormControl>
                    </FormGroup>
                )
            case RenderedInputName.GLIDER:
                return (
                    <FormGroup>
                        <FormControl>
                            <Autocomplete
                                id="glider"
                                options={getGliders()}
                                value={gliderId ? getGliderById(gliderId) : null}
                                onChange={(_, newValue) => setGliderId(newValue?.id)}
                                getOptionLabel={(option: GliderSchema) => getGliderDisplayValue(
                                    option,
                                    glidersStoreState.ownerships?.filter((ownership) => ownership.glider_id === option.id) || [],
                                    true
                                )}
                                open={autocompleteOpen}
                                onOpen={() => setAutocompleteOpen(true)}
                                renderInput={(params) => {
                                    return (
                                        <TextField
                                            {...params}
                                            label={t("GLIDER")}
                                        />
                                    )
                                }}
                            />
                        </FormControl>
                    </FormGroup>
                )
            case RenderedInputName.GLIDER_PILOT:
                return (
                    <FormGroup>
                        <FormControl>
                            <Autocomplete
                                id="gliderPilot"
                                options={getGliderPilots()}
                                value={gliderPilotId ? getMemberById(gliderPilotId) : null}
                                onChange={(_, newValue) => setGliderPilotId(newValue?.id)}
                                getOptionLabel={(option) => getMemberDisplayValue(
                                    option,
                                )}
                                open={autocompleteOpen}
                                onOpen={() => setAutocompleteOpen(true)}
                                renderInput={(params) => {
                                    return (
                                        <TextField
                                            {...params}
                                            label={t("GLIDER_PILOT")}
                                        />
                                    )
                                }}
                            />
                        </FormControl>
                    </FormGroup>
                )
            case RenderedInputName.TOW_AIRPLANE:
                return (
                    <FormGroup>
                        <FormControl>
                            <Autocomplete
                                id="towAirplane"
                                options={getTowAirplanes()}
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
                                options={getTowPilots()}
                                value={towPilotId ? getMemberById(towPilotId) : null}
                                onChange={(_, newValue) => setTowPilotId(newValue?.id)}
                                getOptionLabel={(option) => getMemberDisplayValue(
                                    option,
                                    membersStoreState.membersRoles?.filter((role) => role.member_id === option.id) || [],
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

    function renderGliderPilotReport() {
        if (!gliderPilotId) {
            return null;
        }

        const flights = getFlightsByGliderPilot()
        return renderFlightsSummary(flights);
    }

    function renderGliderReport() {
        if (!gliderId) {
            return null;
        }

        const flights = currentActionStoreState
            .flights?.filter((flight) => flight.state !== "Draft")
            .filter((flight) => flight.glider_id === gliderId) || [];

        return renderFlightsSummary(flights);
    }

    function renderTowPilotReport() {
        if (!towPilotId) {
            return null;
        }

        const flights = currentActionStoreState
            .flights?.filter((flight) => flight.state !== "Draft")
            .filter((flight) => flight.tow_pilot_id === towPilotId) || [];

        return renderFlightsSummary(flights, false);
    }

    function renderFlightsSummary(flights: FlightSchema[], includeTotalDuration = true) {
        const durations = flights
            .filter((flight) => flight.take_off_at)
            .filter((flight) => flight.state !== "Draft")
            .map((flight) => ({
                startTime: flight.take_off_at as string,
                endTime: flight.landing_at || undefined,
            }));

        return (
            <>
            <Grid sx={{
                    mt: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                }}>
                <Grid>
                    <strong>{t("NUM_FLIGHTS")}</strong>: {flights.length}
                </Grid>
                {includeTotalDuration && <Grid item>
                    <strong>{t("TOTAL_DURATION")}</strong>: <Duration durations={durations}/> ({t("HOURS_MINUTES_SECONDS")})
                </Grid>}
                <Grid>
                    <FlightsTable flights={flights} shownFlightStates={[
                        "Tow",
                        "Inflight",
                        "Landed",
                    ]} />
                </Grid>
                <Grid sx={{
                    display: "flex",
                    justifyContent: "center",
                }}>
                  <Button variant="contained" color="primary" size={"large"} onClick={() => setSendEmailDialogOpen(true)}>
                    {t("SEND_EMAIL")}
                  </Button>
                </Grid>
            </Grid>
                {sendEmailDialogOpen && (
                    <FlightsTableSendEmailDialog
                        flights={flights}
                        open={sendEmailDialogOpen}
                        onClose={() => setSendEmailDialogOpen(false)}
                    />
                )}
            </>
        )
    }

    function renderTowAirplaneReport() {
        if (!towAirplaneId) {
            return null;
        }

        const flights = currentActionStoreState
            .flights?.filter((flight) => flight.state !== "Draft")
            .filter((flight) => flight.tow_airplane_id === towAirplaneId) || [];

        return renderFlightsSummary(flights, false);
    }

    function renderSummaryContent() {
        if (!reportType) {
            return null;
        }

        switch (reportType) {
            case ReportType.GLIDER_PILOT:
                return renderGliderPilotReport();
            case ReportType.GLIDER:
                return renderGliderReport();
            case ReportType.TOW_PILOT:
                return renderTowPilotReport();
            case ReportType.TOW_AIRPLANE:
                return renderTowAirplaneReport();
            default:
                return null;
        }
    }

    function renderSummary() {
        return (
            <Grid>
                {reportType && (
                    <Grid>
                        <strong>{t("REPORT_TYPE")}</strong>: {t(reportType)}
                    </Grid>
                )}
                {gliderId && (
                    <Grid>
                        <strong>{t("GLIDER")}</strong>: {displayGlider(gliderId)}
                    </Grid>
                )}
                {gliderPilotId && (
                    <Grid>
                        <strong>{t("GLIDER_PILOT")}</strong>: {displayMember(gliderPilotId)}
                    </Grid>
                )}
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
                <Grid>
                    {renderSummaryContent()}
                </Grid>
            </Grid>
        )
    }

    const getFlightsByGliderPilot = useCallback(() => {
        if (!currentActionStoreState.flights) {
            return [];
        }

        return currentActionStoreState.flights
            .filter((flight) => flight.state !== "Draft")
            .filter((flight) => flight.pilot_1_id === gliderPilotId || flight.pilot_2_id === gliderPilotId);
    }, [currentActionStoreState.flights, gliderPilotId]);

    function onClear() {
        setGliderId(null);
        setGliderPilotId(null);
        setTowAirplaneId(null);
        setTowPilotId(null);
        setReportType(null);
    }

    if (!action) {
        return null;
    }

    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Dialog open={open} maxWidth="xl">
            <DialogTitle sx={{
                fontSize: "2rem",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between",
            }}>
                <div>{t("GENERATE_SUMMARY")}</div>
                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                }}>
                    <Button onClick={() => {
                        onClear();
                        onClose()
                    }}>
                        {t("CLOSE")}
                    </Button>
                    <Button onClick={() => {
                        if (!confirm(t("CLEAR_CONFIRMATION"))) {
                            return
                        }

                        onClear()
                    }}>
                        {t("CLEAR")}
                    </Button>
                </div>
            </DialogTitle>
            <DialogContent>
                {renderSummary()}
                <Grid sx={{
                    mt: 2,
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
