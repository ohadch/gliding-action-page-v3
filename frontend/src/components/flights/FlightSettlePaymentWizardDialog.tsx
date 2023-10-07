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
import {fetchGliderOwners, fetchGliders} from "../../store/actions/glider.ts";
import {fetchTowAirplanes} from "../../store/actions/towAirplane.ts";
import {
    getMemberDisplayValue,
    getPaymentMethodDisplayValue
} from "../../utils/display.ts";
import {SUPPORTED_PAYMENT_METHODS} from "../../utils/consts.ts";

enum RenderedInputName {
    PAYMENT_RECEIVER = "PAYMENT_RECEIVER",
    PAYMENT_METHOD = "PAYMENT_METHOD",
    PAYING_MEMBER = "PAYING_MEMBER",
}

export interface FlightSettlePaymentWizardDialogProps {
    flight: FlightSchema
    open: boolean
    onClose: () => void
    onSubmit: (flight: FlightUpdateSchema) => void
}

export default function FlightSettlePaymentWizardDialog({
                                                            flight,
                                                            open,
                                                            onClose,
                                                            onSubmit,
                                                        }: FlightSettlePaymentWizardDialogProps) {
    const dispatch = useAppDispatch();
    const membersStoreState = useSelector((state: RootState) => state.members)
    const glidersStoreState = useSelector((state: RootState) => state.gliders)
    const towAirplanesStoreState = useSelector((state: RootState) => state.towAirplanes)
    const action = useSelector((state: RootState) => state.actions.actions?.find((action) => action.id === state.currentAction.actionId))
    const [paymentIsByClubMember, setPaymentIsByClubMember] = useState<boolean>(false)

    const {
        t
    } = useTranslation()

    const getMemberById = useCallback((id: number) => membersStoreState.members?.find((member) => member.id === id), [membersStoreState.members]);

    const [paymentReceiverId, setPaymentReceiverId] = useState<number | null | undefined>();
    const [payingMemberId, setPayingMemberId] = useState<number | null | undefined>();
    const [paymentMethod, setPaymentMethod] = useState<string | null | undefined>();

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
        if (paymentIsByClubMember) {
            if (!payingMemberId) {
                return RenderedInputName.PAYING_MEMBER;
            }
        } else {
            if (!paymentReceiverId) {
                return RenderedInputName.PAYMENT_RECEIVER;
            }

            if (!paymentMethod) {
                return RenderedInputName.PAYMENT_METHOD;
            }
        }
    }

    const displayMember = (id: number) => {
        const member = getMemberById(id);
        return member ? getMemberDisplayValue(
            member,
        ) : "";
    }

    function renderInput(inputName: RenderedInputName) {
        switch (inputName) {
            case RenderedInputName.PAYMENT_RECEIVER:
                return (
                    <FormGroup>
                        <FormControl>
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item xs={7}>
                                    <Autocomplete
                                        id="paymentReceiver"
                                        options={membersStoreState.members || []}
                                        value={paymentReceiverId ? getMemberById(paymentReceiverId) : null}
                                        onChange={(_, newValue) => setPaymentReceiverId(newValue?.id)}
                                        getOptionLabel={(option) => getMemberDisplayValue(
                                            option,
                                        )}
                                        open={autocompleteOpen}
                                        onOpen={() => setAutocompleteOpen(true)}
                                        renderInput={(params) => {
                                            return (
                                                <TextField
                                                    {...params}
                                                    label={t("PAYMENT_RECEIVER")}
                                                />
                                            )
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <Button
                                        variant={"text"}
                                        onClick={() => setPaymentIsByClubMember(true)}
                                        fullWidth
                                    >
                                        {t("PAYMENT_BY_CLUB_MEMBER")}?
                                    </Button>
                                </Grid>
                            </Grid>
                        </FormControl>
                    </FormGroup>
                )
            case RenderedInputName.PAYMENT_METHOD:
                return (
                    <FormGroup>
                        <FormControl>
                            <Autocomplete
                                id="paymentMethod"
                                options={SUPPORTED_PAYMENT_METHODS}
                                value={paymentMethod}
                                onChange={(_, newValue) => setPaymentMethod(newValue)}
                                getOptionLabel={(option) => getPaymentMethodDisplayValue(option as never)}
                                open={autocompleteOpen}
                                onOpen={() => setAutocompleteOpen(true)}
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
                )
            case RenderedInputName.PAYING_MEMBER:
                return (
                    <FormGroup>
                        <FormControl>
                            <Autocomplete
                                id="payingMember"
                                options={membersStoreState.members || []}
                                value={payingMemberId ? getMemberById(payingMemberId) : null}
                                onChange={(_, newValue) => setPayingMemberId(newValue?.id)}
                                getOptionLabel={(option) => getMemberDisplayValue(
                                    option,
                                )}
                                open={autocompleteOpen}
                                onOpen={() => setAutocompleteOpen(true)}
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
                )
            default:
                return null;
        }
    }

    const renderedInputName = getInputToRender();

    function renderPaymentPreview() {
        return (
            <Grid>
                {paymentReceiverId && (
                    <Grid>
                        <strong>{t("PAYMENT_RECEIVER")}</strong>: {displayMember(paymentReceiverId)}
                    </Grid>
                )}
                {paymentMethod && (
                    <Grid>
                        <strong>{t("PAYMENT_METHOD")}</strong>: {getPaymentMethodDisplayValue(paymentMethod as never)}
                    </Grid>
                )}
                {payingMemberId && (
                    <Grid>
                        <strong>{t("PAYING_MEMBER")}</strong>: {displayMember(payingMemberId)}
                    </Grid>
                )}
            </Grid>
        )
    }

    const isSubmitEnabled = () => {
        return Boolean((paymentMethod && paymentReceiverId) || payingMemberId)
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
                <div>{t("SETTLE_PAYMENT")}</div>
                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                }}>
                    <Button onClick={onClose}>
                        {t("CANCEL")}
                    </Button>
                    <Button onClick={() => {
                        if (!confirm(t("CLEAR_CONFIRMATION"))) {
                            return
                        }

                        setPaymentReceiverId(null);
                        setPaymentMethod(null);
                        setPayingMemberId(null);
                    }}>
                        {t("CLEAR")}
                    </Button>
                    <Button
                        disabled={!isSubmitEnabled()}
                        onClick={() => onSubmit({
                            ...flight,
                            payment_method: paymentMethod as never,
                            payment_receiver_id: paymentReceiverId,
                            paying_member_id: payingMemberId,
                        })}>
                        {t("CONFIRM")}
                    </Button>
                </div>
            </DialogTitle>
            <DialogContent>
                {renderPaymentPreview()}
                <Grid sx={{
                    mt: 2,
                    width: 600,
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
