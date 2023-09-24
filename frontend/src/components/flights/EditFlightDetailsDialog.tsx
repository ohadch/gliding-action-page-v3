import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormGroup,
    FormControl, Autocomplete, TextField, Grid
} from "@mui/material";
import {useEffect, useState} from "react";
import {
    FlightCreateSchema,
    FlightType, FlightUpdateSchema,
    GliderSchema,
    MemberSchema, PayersType, PaymentMethod,
    TowAirplaneSchema, TowType,
} from "../../lib/types.ts";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../store";
import {fetchMembers, fetchMembersRoles} from "../../store/actions/member.ts";
import {fetchGliders} from "../../store/actions/glider.ts";
import {fetchTowAirplanes} from "../../store/actions/towAirplane.ts";
import {
    getFlightTypeDisplayValue,
    getPayersTypeDisplayValue,
    getPaymentMethodDisplayValue,
    getTowTypeDisplayValue
} from "../../utils/display.ts";
import {
    SUPPORTED_FLIGHT_TYPES,
    SUPPORTED_PAYERS_TYPES,
    SUPPORTED_PAYMENT_METHODS,
    SUPPORTED_TOW_TYPES
} from "../../utils/consts.ts";
import {TimePicker} from "@mui/x-date-pickers";
import moment from "moment";

export interface EditFlightDetailsDialogProps {
    flightId?: number | null
    flightData: FlightUpdateSchema
    open: boolean
    onCancel: () => void
    onCreate: (flight: FlightCreateSchema) => void
    onUpdate: (flightId: number, flight: FlightUpdateSchema) => void
}

export default function EditFlightDetailsDialog({
                                                    flightId,
                                                    flightData,
                                                    open,
                                                    onCancel,
                                                    onCreate,
                                                    onUpdate
                                                }: EditFlightDetailsDialogProps) {
    const dispatch = useAppDispatch();
    const membersStoreState = useSelector((state: RootState) => state.members)
    const glidersStoreState = useSelector((state: RootState) => state.gliders)
    const towAirplanesStoreState = useSelector((state: RootState) => state.towAirplanes)
    const {action} = useSelector((state: RootState) => state.currentAction)

    const {
        t
    } = useTranslation()

    useEffect(() => {
        if (!membersStoreState.members && !membersStoreState.fetchInProgress) {
            dispatch(fetchMembers());
            dispatch(fetchMembersRoles());
        }
    });

    useEffect(() => {
        if (!glidersStoreState.gliders && !glidersStoreState.fetchInProgress) {
            dispatch(fetchGliders());
        }
    });

    useEffect(() => {
        if (!towAirplanesStoreState.towAirplanes && !towAirplanesStoreState.fetchInProgress) {
            dispatch(fetchTowAirplanes());
        }
    });

    const getMemberById = (id: number) => membersStoreState.members?.find((member) => member.id === id);
    const getGliderById = (id: number) => glidersStoreState.gliders?.find((glider) => glider.id === id);
    const getTowAirplaneById = (id: number) => towAirplanesStoreState.towAirplanes?.find((towAirplane) => towAirplane.id === id);


    const [gliderId, setGliderId] = useState<number | null | undefined>(flightData.glider_id);
    const [pilot1Id, setPilot1Id] = useState<number | null | undefined>(flightData.pilot_1_id);
    const [pilot2Id, setPilot2Id] = useState<number | null | undefined>(flightData.pilot_2_id);
    const [towAirplaneId, setTowAirplaneId] = useState<number | null | undefined>(flightData.tow_airplane_id);
    const [towPilotId, setTowPilotId] = useState<number | null | undefined>(flightData.tow_pilot_id);
    const [payingMemberId, setPayingMemberId] = useState<number | null | undefined>(flightData.paying_member_id);
    const [paymentReceiverId, setPaymentReceiverId] = useState<number | null | undefined>(flightData.payment_receiver_id);
    const [flightType, setFlightType] = useState<FlightType | null | undefined>(flightData.flight_type);
    const [towType, setTowType] = useState<TowType | null | undefined>(flightData.tow_type);
    const [payersType, setPayersType] = useState<PayersType | null | undefined>(flightData.payers_type);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null | undefined>(flightData.payment_method);
    const [takeOffat, setTakeOffat] = useState<Date | null | undefined>(flightData.take_off_at ? new Date(flightData.take_off_at) : null);
    const [landingAt, setLandingAt] = useState<Date | null | undefined>(flightData.landing_at ? new Date(flightData.landing_at) : null);


    if (!action) {
        return null;
    }

    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Dialog open={open} maxWidth="xl">
            <DialogTitle>
                {flightId ? t("EDIT_FLIGHT") : t("CREATE_FLIGHT")}
            </DialogTitle>
            <DialogContent>
                <div style={{
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
                                    options={glidersStoreState.gliders || []}
                                    value={gliderId ? getGliderById(gliderId) : null}
                                    onChange={(_, newValue) => setGliderId(newValue?.id)}
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
                                    label={t("TAKE_OFF_TIME")}
                                    value={takeOffat ? moment(takeOffat) : null}
                                    onChange={(newValue: moment.Moment | null) => {
                                        if (!newValue) {
                                            setTakeOffat(null);
                                            return;
                                        }

                                        if (!action?.date) {
                                            return;
                                        }

                                        const date = new Date(action.date);
                                        const newDate = newValue.toDate();
                                        date.setHours(newDate.getHours());
                                        date.setMinutes(newDate.getMinutes());
                                        date.setSeconds(newDate.getSeconds());
                                        setTakeOffat(date);
                                    }}
                                />
                            </FormControl>
                        </FormGroup>
                        <FormGroup>
                            <FormControl style={{
                                direction: "ltr",
                            }}>
                                <TimePicker
                                    label={t("LANDING_TIME")}
                                    value={landingAt ? moment(landingAt) : null}
                                    onChange={(newValue: moment.Moment | null) => {
                                        if (!newValue) {
                                            setLandingAt(null);
                                            return;
                                        }

                                        if (!action?.date) {
                                            return;
                                        }

                                        const date = new Date(action.date);
                                        const newDate = newValue.toDate();
                                        newDate.setDate(date.getDate());
                                        newDate.setMonth(date.getMonth());
                                        newDate.setFullYear(date.getFullYear());
                                        setLandingAt(newDate);
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
                                    options={membersStoreState.members || []}
                                    value={pilot1Id ? getMemberById(pilot1Id) : null}
                                    onChange={(_, newValue) => setPilot1Id(newValue?.id)}
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
                                    options={membersStoreState.members || []}
                                    value={pilot2Id ? getMemberById(pilot2Id) : null}
                                    onChange={(_, newValue) => setPilot2Id(newValue?.id)}
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
                                    options={towAirplanesStoreState.towAirplanes || []}
                                    value={towAirplaneId ? getTowAirplaneById(towAirplaneId) : null}
                                    onChange={(_, newValue) => setTowAirplaneId(newValue?.id)}
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
                                    options={membersStoreState.members || []}
                                    value={towPilotId ? getMemberById(towPilotId) : null}
                                    onChange={(_, newValue) => setTowPilotId(newValue?.id)}
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
                                    options={membersStoreState.members || []}
                                    value={payingMemberId ? getMemberById(payingMemberId) : null}
                                    onChange={(_, newValue) => setPayingMemberId(newValue?.id)}
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
                                    options={membersStoreState.members || []}
                                    value={paymentReceiverId ? getMemberById(paymentReceiverId) : null}
                                    onChange={(_, newValue) => setPaymentReceiverId(newValue?.id)}
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
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>
                    {t("CANCEL")}
                </Button>
                {!flightId && (
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    <Button onClick={() => onCreate({
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
                    })}>
                        {t("CONFIRM")}
                    </Button>
                )}
                {flightId && (
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    <Button onClick={() => onUpdate(flightId, {
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
                    })}>
                        {t("CONFIRM")}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    )
}
