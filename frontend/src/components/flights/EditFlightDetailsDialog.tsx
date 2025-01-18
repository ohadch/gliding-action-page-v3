import {
    FlightCreateSchema,
    FlightSchema,
    FlightType,
    FlightUpdateSchema,
    GliderSchema,
    MemberSchema,
    PayersType, PaymentMethod,
    TowAirplaneSchema,
    TowType
} from "../../lib/types";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, FormGroup, FormControl, Autocomplete, TextField} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import {TimePicker} from "@mui/x-date-pickers";
import moment from "moment";
import {
    getFlightTypeDisplayValue,
    getPayersTypeDisplayValue, getPaymentMethodDisplayValue,
    getTowTypeDisplayValue
} from "../../utils/display";
import {
    SUPPORTED_FLIGHT_TYPES,
    SUPPORTED_PAYERS_TYPES,
    SUPPORTED_PAYMENT_METHODS,
    SUPPORTED_TOW_TYPES
} from "../../utils/consts";
import CommentsTable from "../comments/CommentsTable";
import { getTowPilots } from "../../store";

interface EditFlightDetailsDialogProps {
    flightId: number | null;
    flightData: FlightSchema;
    open: boolean;
    onCancel: () => void;
    onCreate: (flight: FlightCreateSchema) => void;
    onUpdate: (flightId: number, flight: FlightUpdateSchema) => void;
}

export default function EditFlightDetailsDialog({
    flightId,
    flightData,
    open,
    onCancel,
    onCreate,
    onUpdate
}: EditFlightDetailsDialogProps) {
    const action = useSelector((state: RootState) =>
        state.actionDays.list.actions?.find(
            (action) => action.id === state.actionDays.currentDay.currentActionId
        )
    );
    const membersState = useSelector((state: RootState) => state.members);
    const aircraftState = useSelector((state: RootState) => state.aircraft);
    const {comments: currentFlightComments} = useSelector((state: RootState) => state.actionDays.currentDay);
    const {t} = useTranslation();

    // State management
    const [flightType, setFlightType] = useState<FlightType | null>(flightData.flight_type || null);
    const [gliderId, setGliderId] = useState<number | null>(flightData.glider_id || null);
    const [pilot1Id, setPilot1Id] = useState<number | null>(flightData.pilot_1_id || null);
    const [pilot2Id, setPilot2Id] = useState<number | null>(flightData.pilot_2_id || null);
    const [towAirplaneId, setTowAirplaneId] = useState<number | null>(flightData.tow_airplane_id || null);
    const [towPilotId, setTowPilotId] = useState<number | null>(flightData.tow_pilot_id || null);
    const [towType, setTowType] = useState<TowType | null>(flightData.tow_type || null);
    const [payersType, setPayersType] = useState<PayersType | null>(flightData.payers_type || null);
    const [payingMemberId, setPayingMemberId] = useState<number | null>(flightData.paying_member_id || null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(flightData.payment_method || null);
    const [paymentReceiverId, setPaymentReceiverId] = useState<number | null>(flightData.payment_receiver_id || null);
    const [takeOffat, setTakeOffAt] = useState<moment.Moment | null>(
        flightData.take_off_at ? moment.utc(flightData.take_off_at) : null
    );
    const [landingAt, setLandingAt] = useState<moment.Moment | null>(
        flightData.landing_at ? moment.utc(flightData.landing_at) : null
    );
    const [towReleaseAt, setTowReleaseAt] = useState<moment.Moment | null>(
        flightData.tow_release_at ? moment.utc(flightData.tow_release_at) : null
    );

    // Helper functions
    const getMemberById = (id: number) => membersState.members?.find((member) => member.id === id);
    const getGliderById = (id: number) => aircraftState.gliders?.find((glider) => glider.id === id);
    const getTowAirplaneById = (id: number) => aircraftState.towAirplanes?.find((towAirplane) => towAirplane.id === id);

    function getPilot1Options() {
        const initialOptions = membersState.members || [];
        return initialOptions.filter((member) => ![
            pilot2Id,
            towPilotId,
            paymentReceiverId
        ].filter(Boolean).includes(member.id));
    }

    function getPilot2Options() {
        const initialOptions = membersState.members || [];
        return initialOptions.filter((member) => ![
            pilot1Id,
            towPilotId,
            paymentReceiverId
        ].filter(Boolean).includes(member.id));
    }

    function getTowPilotOptions() {
        const towPilots = getTowPilots({ members: membersState } as RootState);
        return towPilots.filter((member) => ![
            pilot1Id,
            pilot2Id,
            paymentReceiverId
        ].filter(Boolean).includes(member.id));
    }

    function renderFlightComments() {
        if (!flightId) {
            return null;
        }

        return (
            <CommentsTable
                comments={currentFlightComments || []}
                flightId={flightId}
            />
        )
    }

    if (!action) {
        return null;
    }

    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Dialog open={open} maxWidth="xl">
            <DialogTitle
                sx={{
                fontSize: "2rem",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between",
            }}
            >
                {flightId ? t("EDIT_FLIGHT") : t("CREATE_FLIGHT")}
                {flightId? ` (${t("ID")}: ${flightId})` : ""}
            </DialogTitle>
            <DialogContent>
                <Grid
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Grid style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 20,
                        paddingTop: 10,
                    }}>
                        <Grid sx={{
                            width: 400,
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                        }}>
                            <FormGroup>
                                <FormControl>
                                    <Autocomplete
                                        id="flight-type"
                                        options={SUPPORTED_FLIGHT_TYPES}
                                        value={flightType}
                                        getOptionLabel={(option: FlightType) => getFlightTypeDisplayValue(option)}
                                        onChange={(_, newValue) => setFlightType(newValue)}
                                        renderInput={(params) => {
                                            return (
                                                <TextField
                                                    {...params}
                                                    label={t("FLIGHT_TYPE")}
                                                />
                                            )
                                        }}
                                    />
                                </FormControl>
                            </FormGroup>
                            <FormGroup>
                                <FormControl>
                                    <Autocomplete
                                        id="glider"
                                        options={aircraftState.gliders || []}
                                        value={gliderId ? getGliderById(gliderId) : null}
                                        onChange={(_, newValue) => setGliderId(newValue?.id ? newValue.id : null)}
                                        getOptionLabel={(option: GliderSchema) => option.call_sign}
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
                            <FormGroup>
                                <FormControl style={{
                                    direction: "ltr",
                                }}>
                                    <TimePicker
                                        views={["minutes", "hours"]}
                                        ampm={false}
                                        ampmInClock={false}
                                        timeSteps={{minutes: 1}}
                                        label={t("TAKE_OFF_TIME")}
                                        value={takeOffat ? takeOffat.local() : null}
                                        onChange={(newValue: moment.Moment | null) => {
                                            if (!newValue || !action?.date) {
                                                setTakeOffAt(null);
                                                return;
                                            }

                                            const date = moment.utc(action.date)
                                                .hour(newValue.hour())
                                                .minute(newValue.minute())
                                                .second(newValue.second());
                                            
                                            setTakeOffAt(date);
                                        }}
                                    />
                                </FormControl>
                            </FormGroup>
                            <FormGroup>
                                <FormControl style={{
                                    direction: "ltr",
                                }}>
                                    <TimePicker
                                        views={["minutes", "hours"]}
                                        ampm={false}
                                        ampmInClock={false}
                                        timeSteps={{minutes: 1}}
                                        label={t("TOW_RELEASE_TIME")}
                                        value={towReleaseAt ? towReleaseAt.local() : null}
                                        onChange={(newValue: moment.Moment | null) => {
                                            if (!newValue || !action?.date) {
                                                setTowReleaseAt(null);
                                                return;
                                            }

                                            const date = moment.utc(action.date)
                                                .hour(newValue.hour())
                                                .minute(newValue.minute())
                                                .second(newValue.second());
                                            
                                            setTowReleaseAt(date);
                                        }}
                                    />
                                </FormControl>
                            </FormGroup>
                            <FormGroup>
                                <FormControl style={{
                                    direction: "ltr",
                                }}>
                                    <TimePicker
                                        views={["minutes", "hours"]}
                                        ampm={false}
                                        ampmInClock={false}
                                        timeSteps={{minutes: 1}}
                                        label={t("LANDING_TIME")}
                                        value={landingAt ? landingAt.local() : null}
                                        onChange={(newValue: moment.Moment | null) => {
                                            if (!newValue || !action?.date) {
                                                setLandingAt(null);
                                                return;
                                            }

                                            const date = moment.utc(action.date)
                                                .hour(newValue.hour())
                                                .minute(newValue.minute())
                                                .second(newValue.second());
                                            
                                            setLandingAt(date);
                                        }}
                                    />
                                </FormControl>
                            </FormGroup>
                        </Grid>
                        <Grid sx={{
                            width: 400,
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                        }}>
                            <FormGroup>
                                <FormControl>
                                    <Autocomplete
                                        id="pilot-1"
                                        options={getPilot1Options()}
                                        value={pilot1Id ? getMemberById(pilot1Id) : null}
                                        onChange={(_, newValue) => setPilot1Id(newValue?.id ? newValue.id : null)}
                                        getOptionLabel={(option: MemberSchema) => `${option.first_name} ${option.last_name}`}
                                        renderInput={(params) => {
                                            return (
                                                <TextField
                                                    {...params}
                                                    label={t("PILOT_1")}
                                                />
                                            )
                                        }}
                                    />
                                </FormControl>
                            </FormGroup>
                            <FormGroup>
                                <FormControl>
                                    <Autocomplete
                                        id="pilot-2"
                                        options={getPilot2Options()}
                                        value={pilot2Id ? getMemberById(pilot2Id) : null}
                                        onChange={(_, newValue) => setPilot2Id(newValue?.id ? newValue.id : null)}
                                        getOptionLabel={(option: MemberSchema) => `${option.first_name} ${option.last_name}`}
                                        renderInput={(params) => {
                                            return (
                                                <TextField
                                                    {...params}
                                                    label={t("PILOT_2")}
                                                />
                                            )
                                        }}
                                    />
                                </FormControl>
                            </FormGroup>
                        </Grid>
                        <Grid
                            sx={{
                                width: 400,
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                            }}
                        >
                            <FormGroup>
                                <FormControl>
                                    <Autocomplete
                                        id="tow-airplane"
                                        options={aircraftState.towAirplanes || []}
                                        value={towAirplaneId ? getTowAirplaneById(towAirplaneId) : null}
                                        onChange={(_, newValue) => setTowAirplaneId(newValue?.id ? newValue.id : null)}
                                        getOptionLabel={(option: TowAirplaneSchema) => option.call_sign}
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
                            <FormGroup>
                                <FormControl>
                                    <Autocomplete
                                        id="tow-pilot"
                                        options={getTowPilotOptions()}
                                        value={towPilotId ? getMemberById(towPilotId) : null}
                                        onChange={(_, newValue) => setTowPilotId(newValue?.id ? newValue.id : null)}
                                        getOptionLabel={(option: MemberSchema) => `${option.first_name} ${option.last_name}`}
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
                            <FormGroup>
                                <FormControl>
                                    <Autocomplete
                                        id="tow-type"
                                        options={SUPPORTED_TOW_TYPES}
                                        value={towType}
                                        getOptionLabel={(option: TowType) => getTowTypeDisplayValue(option)}
                                        onChange={(_, newValue) => setTowType(newValue)}
                                        renderInput={(params) => {
                                            return (
                                                <TextField
                                                    {...params}
                                                    label={t("TOW_TYPE")}
                                                />
                                            )
                                        }}
                                    />
                                </FormControl>
                            </FormGroup>
                        </Grid>
                        <Grid
                            sx={{
                                width: 400,
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                            }}
                        >
                            <FormGroup>
                                <FormControl>
                                    <Autocomplete
                                        id="payers-type"
                                        options={SUPPORTED_PAYERS_TYPES}
                                        value={payersType}
                                        getOptionLabel={(option: PayersType) => getPayersTypeDisplayValue(option)}
                                        onChange={(_, newValue) => setPayersType(newValue)}
                                        renderInput={(params) => {
                                            return (
                                                <TextField
                                                    {...params}
                                                    label={t("PAYERS_TYPE")}
                                                />
                                            )
                                        }}
                                    />
                                </FormControl>
                            </FormGroup>
                            <FormGroup>
                                <FormControl>
                                    <Autocomplete
                                        id="payment-method"
                                        options={SUPPORTED_PAYMENT_METHODS}
                                        value={paymentMethod}
                                        onChange={(_, newValue) => setPaymentMethod(newValue)}
                                        getOptionLabel={(option: PaymentMethod) => getPaymentMethodDisplayValue(option)}
                                        renderInput={(params) => {
                                            return (
                                                <TextField
                                                    {...params}
                                                    label={t("PAYMENT_METHOD")}
                                                />
                                            )
                                        }}
                                    />
                                </FormControl>
                            </FormGroup>
                            <FormGroup>
                                <FormControl>
                                    <Autocomplete
                                        id="paying-member"
                                        options={membersState.members || []}
                                        value={payingMemberId ? getMemberById(payingMemberId) : null}
                                        onChange={(_, newValue) => setPayingMemberId(newValue?.id ? newValue.id : null)}
                                        getOptionLabel={(option: MemberSchema) => `${option.first_name} ${option.last_name}`}
                                        renderInput={(params) => {
                                            return (
                                                <TextField
                                                    {...params}
                                                    label={t("PAYING_MEMBER")}
                                                />
                                            )
                                        }}
                                    />
                                </FormControl>
                            </FormGroup>
                            <FormGroup>
                                <FormControl>
                                    <Autocomplete
                                        id="payment-receiver"
                                        options={membersState.members || []}
                                        value={paymentReceiverId ? getMemberById(paymentReceiverId) : null}
                                        onChange={(_, newValue) => setPaymentReceiverId(newValue?.id ? newValue.id : null)}
                                        getOptionLabel={(option: MemberSchema) => `${option.first_name} ${option.last_name}`}
                                        renderInput={(params) => {
                                            return (
                                                <TextField
                                                    {...params}
                                                    label={t("PAYMENT_RECEIVER")}
                                                />
                                            )
                                        }}
                                    />
                                </FormControl>
                            </FormGroup>
                        </Grid>
                    </Grid>
                    <Grid
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                        }}
                        mt={2}
                    >
                        {renderFlightComments()}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                }}
            >
                <Button
                color={"error"}
                        variant={"contained"}
                        size={"large"}
                        sx={{
                            fontWeight: "bold",
                            fontSize: "1.5rem",
                        }}
                    onClick={onCancel}>
                    {t("CANCEL")}
                </Button>
                {!flightId && (
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    <Button
                    color={"primary"}
                        variant={"contained"}
                        size={"large"}
                        sx={{
                            fontWeight: "bold",
                            fontSize: "1.5rem",
                        }}
                        onClick={() => onCreate({
                        state: "Draft",
                        action_id: action.id,
                        glider_id: gliderId,
                        pilot_1_id: pilot1Id,
                        pilot_2_id: pilot2Id,
                        tow_airplane_id: towAirplaneId,
                        tow_pilot_id: towPilotId,
                        tow_type: towType,
                        flight_type: flightType,
                        payers_type: payersType,
                        payment_method: paymentMethod,
                        paying_member_id: payingMemberId,
                        payment_receiver_id: paymentReceiverId,
                        take_off_at: takeOffat ? takeOffat.toISOString() : null,
                        landing_at: landingAt ? landingAt.toISOString() : null,
                        tow_release_at: towReleaseAt ? towReleaseAt.toISOString() : null,
                    })}>
                        {t("CONFIRM")}
                    </Button>
                )}
                {flightId && (
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    <Button
                    color={"primary"}
                        variant={"contained"}
                        size={"large"}
                        sx={{
                            fontWeight: "bold",
                            fontSize: "1.5rem",
                        }}
                        onClick={() => onUpdate(flightId, {
                        state: flightData.state,
                        action_id: action.id,
                        glider_id: gliderId,
                        pilot_1_id: pilot1Id,
                        pilot_2_id: pilot2Id,
                        tow_airplane_id: towAirplaneId,
                        tow_pilot_id: towPilotId,
                        tow_type: towType,
                        flight_type: flightType,
                        payers_type: payersType,
                        payment_method: paymentMethod,
                        paying_member_id: payingMemberId,
                        payment_receiver_id: paymentReceiverId,
                        take_off_at: takeOffat ? takeOffat.toISOString() : null,
                        landing_at: landingAt ? landingAt.toISOString() : null,
                        tow_release_at: towReleaseAt ? towReleaseAt.toISOString() : null,
                    })}>
                        {t("CONFIRM")}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    )
}
