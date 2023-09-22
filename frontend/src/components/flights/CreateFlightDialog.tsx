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
    FlightSchema,
    FlightTypeSchema,
    GliderSchema,
    MemberSchema, PayersTypeSchema, PaymentMethodSchema,
    TowAirplaneSchema,
    TowTypeSchema
} from "../../lib/types.ts";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../store";
import {fetchMembers} from "../../store/actions/member.ts";
import {fetchGliders} from "../../store/actions/glider.ts";
import {fetchTowAirplanes} from "../../store/actions/towAirplane.ts";
import {fetchTowTypes} from "../../store/actions/towType.ts";
import {fetchFlightTypes} from "../../store/actions/flightType.ts";
import {fetchPayersTypes} from "../../store/actions/payersType.ts";
import {fetchPaymentMethods} from "../../store/actions/paymentMethod.ts";

export interface CreateFlightDialogProps {
    open: boolean
    onCancel: () => void
    onSubmit: (flight: Partial<FlightSchema>) => void
}

export default function CreateFlightDialog({open, onCancel, onSubmit}: CreateFlightDialogProps) {
    const dispatch = useAppDispatch();
    const membersStoreState = useSelector((state: RootState) => state.members)
    const glidersStoreState = useSelector((state: RootState) => state.gliders)
    const towAirplanesStoreState = useSelector((state: RootState) => state.towAirplanes)
    const towTypesStoreState = useSelector((state: RootState) => state.towTypes)
    const flightTypesStoreState = useSelector((state: RootState) => state.flightTypes)
    const payersTypesStoreState = useSelector((state: RootState) => state.payersTypes)
    const paymentMethodsStoreState = useSelector((state: RootState) => state.paymentMethods)

    const {
        t
    } = useTranslation()

    useEffect(() => {
        if (!membersStoreState.members && !membersStoreState.fetchInProgress) {
            dispatch(fetchMembers());
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

    useEffect(() => {
        if (!towTypesStoreState.towTypes && !towTypesStoreState.fetchInProgress) {
            dispatch(fetchTowTypes());
        }
    })

    useEffect(() => {
        if (!flightTypesStoreState.flightTypes && !flightTypesStoreState.fetchInProgress) {
            dispatch(fetchFlightTypes());
        }
    })

    useEffect(() => {
        if (!payersTypesStoreState.payersTypes && !payersTypesStoreState.fetchInProgress) {
            dispatch(fetchPayersTypes());
        }
    })

    useEffect(() => {
        if (!paymentMethodsStoreState.paymentMethods && !paymentMethodsStoreState.fetchInProgress) {
            dispatch(fetchPaymentMethods());
        }
    })

    const getMemberById = (id: number) => membersStoreState.members?.find((member) => member.id === id);
    const getGliderById = (id: number) => glidersStoreState.gliders?.find((glider) => glider.id === id);
    const getTowAirplaneById = (id: number) => towAirplanesStoreState.towAirplanes?.find((towAirplane) => towAirplane.id === id);
    const getTowTypeById = (id: number) => towTypesStoreState.towTypes?.find((towType) => towType.id === id);
    const getFlightTypeById = (id: number) => flightTypesStoreState.flightTypes?.find((flightType) => flightType.id === id);
    const getPayersTypeById = (id: number) => payersTypesStoreState.payersTypes?.find((payersType) => payersType.id === id);
    const getPaymentMethodById = (id: number) => paymentMethodsStoreState.paymentMethods?.find((paymentMethod) => paymentMethod.id === id);


    const [gliderId, setGliderId] = useState<number | undefined>();
    const [pilot1Id, setPilot1Id] = useState<number | undefined>();
    const [pilot2Id, setPilot2Id] = useState<number | undefined>();
    const [towAirplaneId, setTowAirplaneId] = useState<number | undefined>();
    const [towPilotId, setTowPilotId] = useState<number | undefined>();
    const [towTypeId, setTowTypeId] = useState<number | undefined>();
    const [flightTypeId, setFlightTypeId] = useState<number | undefined>();
    const [payersTypeId, setPayersTypeId] = useState<number | undefined>();
    const [paymentMethodId, setPaymentMethodId] = useState<number | undefined>();


    return (
        // @ts-ignore
        <Dialog open={open} maxWidth={true}>
            <DialogTitle>
                {t("CREATE_NEW_FLIGHT")}
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
                                    options={flightTypesStoreState.flightTypes || []}
                                    value={flightTypeId ? getFlightTypeById(flightTypeId) : null}
                                    onChange={(_, newValue) => setFlightTypeId(newValue?.id)}
                                    getOptionLabel={(option: FlightTypeSchema) => option.name}
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
                                    options={towTypesStoreState.towTypes || []}
                                    value={towTypeId ? getTowTypeById(towTypeId) : null}
                                    onChange={(_, newValue) => setTowTypeId(newValue?.id)}
                                    getOptionLabel={(option: TowTypeSchema) => option.name}
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
                                    options={payersTypesStoreState.payersTypes || []}
                                    value={payersTypeId ? getPayersTypeById(payersTypeId) : null}
                                    onChange={(_, newValue) => setPayersTypeId(newValue?.id)}
                                    getOptionLabel={(option: PayersTypeSchema) => option.name}
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
                                    options={paymentMethodsStoreState.paymentMethods || []}
                                    value={paymentMethodId ? getPaymentMethodById(paymentMethodId) : null}
                                    onChange={(_, newValue) => setPaymentMethodId(newValue?.id)}
                                    getOptionLabel={(option: PaymentMethodSchema) => option.name}
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
                    </Grid>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>
                    {t("CANCEL")}
                </Button>
                <Button onClick={() => onSubmit({
                    glider_id: gliderId || null,
                    pilot_1_id: pilot1Id || null,
                    // pilot_2_id: pilot2Id || null,
                    // tow_airplane_id: towAirplaneId || null,
                    // tow_pilot_id: towPilotId || null,
                })}>
                    {t("SELECT")}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
