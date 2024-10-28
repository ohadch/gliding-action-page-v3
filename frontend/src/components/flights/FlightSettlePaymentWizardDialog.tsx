import {
    Autocomplete,
    Button,
    Dialog, DialogActions,
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
        let input = null
        switch (inputName) {
            case RenderedInputName.PAYMENT_RECEIVER:
                input = (
                            <Grid container>
                                <Grid item xs={8} spacing={1}>
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
                                        variant={"outlined"}
                                        color={"warning"}
                                        onClick={() => setPaymentIsByClubMember(true)}
                                        sx={{
                                            fontSize: "1.4rem",
                                            fontWeight: "bold",
                                            marginRight: 2
                                        }}
                                    >
                                        {t("PAYMENT_BY_CLUB_MEMBER")}
                                    </Button>
                                </Grid>
                            </Grid>
                )
                break;
            case RenderedInputName.PAYMENT_METHOD:
                input = (
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
                )
                break;
            case RenderedInputName.PAYING_MEMBER:
                input = (
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
                )
                break;
            default:
                input = null;
        }

        return (
            <FormGroup>
                <FormControl>
                    {input}
                </FormControl>
            </FormGroup>
        )
    }

    const renderedInputName = getInputToRender();

    function renderPaymentPreview() {
        return (
            <Grid sx={{
                fontSize: "1.4rem",
            }}>
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
                fontSize: "2rem",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between",
            }}>
                <div>{t("SETTLE_PAYMENT")}</div>
            </DialogTitle>
            <DialogContent>
                {renderPaymentPreview()}
                <Grid container width={900}>
                    <Grid xs={8} sx={{
                        mt: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                    }}>
                        {renderedInputName && (
                            <Grid container sx={{
                                fontSize: "1.4rem",
                            }}>
                                <Grid item xs={3}>
                                    <strong>{t(renderedInputName)}: </strong>
                                </Grid>
                                <Grid item xs={9}>
                                    {renderInput(renderedInputName)}
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                    <Grid xs={4}></Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid xs={9}></Grid>
                    <Grid xs={3}>
                        <div style={{
                            display: "flex",
                            gap: 4,
                        }}>
                            <Button
                                color={"error"}
                                variant={"contained"}
                                size={"large"}
                                sx={{
                                    fontWeight: "bold",
                                    fontSize: "1.25rem",
                                }}
                                onClick={onClose}>
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

                                    setPaymentReceiverId(null);
                                    setPaymentMethod(null);
                                    setPayingMemberId(null);
                                }}>
                                {t("CLEAR")}
                            </Button>
                            <Button
                                color={"primary"}
                                variant={"contained"}
                                size={"large"}
                                sx={{
                                    fontWeight: "bold",
                                    fontSize: "1.25rem",
                                }}
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
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    )
}
