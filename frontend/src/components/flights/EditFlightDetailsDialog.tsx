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
    CommentCreateSchema, CommentSchema, CommentUpdateSchema,
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
import CommentsTable from "../comments/CommentsTable.tsx";
import {createComment, deleteComment, updateComment} from "../../store/actions/comment.ts";
import {fetchComments} from "../../store/actions/currentAction.ts";
import Typography from "@mui/material/Typography";
import CommentEditDialog from "../comments/CommentEditDialog.tsx";

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
    const action = useSelector((state: RootState) => state.actions.actions?.find((action) => action.id === state.currentAction.actionId))

    const comments = useSelector((state: RootState) => state.currentAction.comments)
    const currentFlightComments = comments?.filter((comment) => comment.flight_id === flightId) || [];

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

    const parseDateStringDropTimezone = (dateString: string) => {
        const momentDate = moment(dateString);
        momentDate.utcOffset(0, true);
        return momentDate;
    }

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
    const [takeOffat, setTakeOffat] = useState<moment.Moment | null | undefined>(flightData.take_off_at ? parseDateStringDropTimezone(flightData.take_off_at) : null);
    const [towReleaseAt, setTowReleaseAt] = useState<moment.Moment | null | undefined>(flightData.tow_release_at ? parseDateStringDropTimezone(flightData.tow_release_at) : null);
    const [landingAt, setLandingAt] = useState<moment.Moment | null | undefined>(flightData.landing_at ? parseDateStringDropTimezone(flightData.landing_at) : null);

    function getPilot1Options() {
        const initialOptions = membersStoreState.members || [];
        return initialOptions.filter((member) => ![
                towPilotId,
                pilot2Id,
            ].filter(Boolean).includes(member.id)
        );
    }

    function getPilot2Options() {
        const initialOptions = membersStoreState.members || [];
        return initialOptions.filter((member) => ![
                towPilotId,
                pilot1Id,
            ].filter(Boolean).includes(member.id)
        );
    }

    function getTowPilotOptions() {
        const initialOptions = membersStoreState.members || [];
        return initialOptions.filter((member) => ![
                pilot1Id,
                pilot2Id,
            ].filter(Boolean).includes(member.id)
        );
    }

    function renderFlightComments() {
        if (!flightId) {
            return null;
        }

        return (
            <CommentsTable
                comments={currentFlightComments}
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
            <DialogTitle>
                {flightId ? t("EDIT_FLIGHT") : t("CREATE_FLIGHT")}
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

                                            // Remove the timezone
                                            newValue.utcOffset(0, true);

                                            const date = moment(action.date);
                                            date.utcOffset(0, true);
                                            date.set({
                                                hour: newValue.hour(),
                                                minute: newValue.minute(),
                                                second: newValue.second(),
                                            });
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
                                        label={t("TOW_RELEASE_TIME")}
                                        value={towReleaseAt ? moment(towReleaseAt) : null}
                                        onChange={(newValue: moment.Moment | null) => {
                                            if (!newValue) {
                                                setTowReleaseAt(null);
                                                return;
                                            }

                                            // Remove the timezone
                                            newValue.utcOffset(0, true);

                                            if (!action?.date) {
                                                return;
                                            }

                                            const date = moment(action.date);
                                            date.utcOffset(0, true);
                                            date.set({
                                                hour: newValue.hour(),
                                                minute: newValue.minute(),
                                                second: newValue.second(),
                                            });
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
                                        label={t("LANDING_TIME")}
                                        value={landingAt ? moment(landingAt) : null}
                                        onChange={(newValue: moment.Moment | null) => {
                                            if (!newValue) {
                                                setLandingAt(null);
                                                return;
                                            }

                                            // Remove the timezone
                                            newValue.utcOffset(0, true);

                                            if (!action?.date) {
                                                return;
                                            }

                                            const date = moment(action.date);
                                            date.utcOffset(0, true);
                                            date.set({
                                                hour: newValue.hour(),
                                                minute: newValue.minute(),
                                                second: newValue.second(),
                                            });
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
                                        options={getPilot2Options()}
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
                                        options={getTowPilotOptions()}
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
