import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button, FormControl, Autocomplete, TextField, FormGroup, Grid,
} from "@mui/material";
import {useEffect, useState} from "react";
import {
    GliderSchema,
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

enum RenderedInputName {
    GLIDER = "GLIDER",
}

export interface FlightCreationWizardDialogProps {
    open: boolean
    onCancel: () => void
    onSubmit: (flight: FlightCreationWizardDialogSubmitPayload) => void
}

export interface FlightCreationWizardDialogSubmitPayload {
    gliderId?: number | null,
    pilot1Id?: number | null,
    pilot2Id?: number | null,
    towAirplaneId?: number | null,
    towPilotId?: number | null,
    towTypeId?: number | null,
    flightTypeId?: number | null,
    payersTypeId?: number | null,
    paymentMethodId?: number | null,
    payingMemberId?: number | null,
    paymentReceiverId?: number | null,
}

export default function FlightCreationWizardDialog({open, onCancel, onSubmit}: FlightCreationWizardDialogProps) {
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

    // const getMemberById = (id: number) => membersStoreState.members?.find((member) => member.id === id);
    const getGliderById = (id: number) => glidersStoreState.gliders?.find((glider) => glider.id === id);
    // const getTowAirplaneById = (id: number) => towAirplanesStoreState.towAirplanes?.find((towAirplane) => towAirplane.id === id);
    // const getTowTypeById = (id: number) => towTypesStoreState.towTypes?.find((towType) => towType.id === id);
    // const getFlightTypeById = (id: number) => flightTypesStoreState.flightTypes?.find((flightType) => flightType.id === id);
    // const getPayersTypeById = (id: number) => payersTypesStoreState.payersTypes?.find((payersType) => payersType.id === id);
    // const getPaymentMethodById = (id: number) => paymentMethodsStoreState.paymentMethods?.find((paymentMethod) => paymentMethod.id === id);
    //
    //
    const [gliderId, setGliderId] = useState<number | null | undefined>();
    // const [pilot1Id, setPilot1Id] = useState<number | null | undefined>();
    // const [pilot2Id, setPilot2Id] = useState<number | null | undefined>();
    // const [towAirplaneId, setTowAirplaneId] = useState<number | null | undefined>();
    // const [towPilotId, setTowPilotId] = useState<number | null | undefined>();
    // const [towTypeId, setTowTypeId] = useState<number | null | undefined>();
    // const [flightTypeId, setFlightTypeId] = useState<number | null | undefined>();
    // const [payersTypeId, setPayersTypeId] = useState<number | null | undefined>(d)
    // const [paymentMethodId, setPaymentMethodId] = useState<number | null | undefined>();
    // const [payingMemberId, setPayingMemberId] = useState<number | null | undefined>();
    // const [paymentReceiverId, setPaymentReceiverId] = useState<number | null | undefined>();

    const [autocompleteOpen, setAutocompleteOpen] = useState(true);

    function getInputToRender() {
        if (!gliderId) {
            return RenderedInputName.GLIDER;
        }

        const glider = getGliderById(gliderId);

        if (!glider) {
            throw new Error("Glider not found");
        }

        return null;
    }

    function renderInput(inputName: RenderedInputName) {
        switch (inputName) {
            case RenderedInputName.GLIDER:
                return (
                    <FormGroup>
                        <FormControl>
                            <Autocomplete
                                id="glider"
                                options={glidersStoreState.gliders || []}
                                value={gliderId ? getGliderById(gliderId) : null}
                                onChange={(_, newValue) => setGliderId(newValue?.id)}
                                getOptionLabel={(option: GliderSchema) => option.call_sign}
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
            default:
                return null;
        }
    }

    const renderedInputName = getInputToRender();

    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Dialog open={open} maxWidth="xl">
            <DialogTitle>
                {t("CREATE_NEW_FLIGHT")}
            </DialogTitle>
            <DialogContent>
                <Grid sx={{
                    width: 400,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                }}>
                    {renderedInputName && renderInput(renderedInputName)}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>
                    {t("CANCEL")}
                </Button>
                <Button onClick={() => onSubmit({})}>
                    {t("CREATE")}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
