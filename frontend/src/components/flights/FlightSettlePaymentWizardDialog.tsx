import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormGroup,
    Grid,
    TextField,
} from "@mui/material";
import { useCallback, useState } from "react";
import { FlightSchema, FlightUpdateSchema } from "../../lib/types";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getMemberDisplayValue, getPaymentMethodDisplayValue } from "../../utils/display";
import { SUPPORTED_PAYMENT_METHODS } from "../../utils/consts";

enum RenderedInputName {
    PAYMENT_RECEIVER = "PAYMENT_RECEIVER",
    PAYMENT_METHOD = "PAYMENT_METHOD",
    PAYING_MEMBER = "PAYING_MEMBER",
}

export interface FlightSettlePaymentWizardDialogProps {
    flight: FlightSchema;
    open: boolean;
    onClose: () => void;
    onSubmit: (flight: FlightUpdateSchema) => void;
}

export default function FlightSettlePaymentWizardDialog({
    flight,
    open,
    onClose,
    onSubmit,
}: FlightSettlePaymentWizardDialogProps) {
    const { t } = useTranslation();
    const membersState = useSelector((state: RootState) => state.members);
    const action = useSelector((state: RootState) => 
        state.actionDays.list.actions?.find(
            (action) => action.id === state.actionDays.currentDay.currentActionId
        )
    );

    const [paymentIsByClubMember, setPaymentIsByClubMember] = useState<boolean>(false);
    const [paymentReceiverId, setPaymentReceiverId] = useState<number | null>(null);
    const [payingMemberId, setPayingMemberId] = useState<number | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
    const [autocompleteOpen, setAutocompleteOpen] = useState(true);

    const getMemberById = useCallback(
        (id: number) => membersState.members?.find((member) => member.id === id),
        [membersState.members]
    );

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
        return null;
    }

    const displayMember = (id: number) => {
        const member = getMemberById(id);
        return member ? getMemberDisplayValue(member) : "";
    };

    function renderInput(inputName: RenderedInputName) {
        switch (inputName) {
            case RenderedInputName.PAYMENT_RECEIVER:
                return (
                    <Grid container>
                        <Grid item xs={8} spacing={1}>
                            <Autocomplete
                                id="paymentReceiver"
                                options={membersState.members || []}
                                value={paymentReceiverId ? getMemberById(paymentReceiverId) : null}
                                onChange={(_, newValue) => setPaymentReceiverId(newValue?.id || null)}
                                getOptionLabel={(option) => getMemberDisplayValue(option)}
                                open={autocompleteOpen}
                                onOpen={() => setAutocompleteOpen(true)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={t("PAYMENT_RECEIVER")}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Button
                                variant="outlined"
                                color="warning"
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
                );
            case RenderedInputName.PAYMENT_METHOD:
                return (
                    <Autocomplete
                        id="paymentMethod"
                        options={SUPPORTED_PAYMENT_METHODS}
                        value={paymentMethod}
                        onChange={(_, newValue) => setPaymentMethod(newValue)}
                        getOptionLabel={(option) => getPaymentMethodDisplayValue(option)}
                        open={autocompleteOpen}
                        onOpen={() => setAutocompleteOpen(true)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t("PAYMENT_METHOD")}
                            />
                        )}
                    />
                );
            case RenderedInputName.PAYING_MEMBER:
                return (
                    <Autocomplete
                        id="payingMember"
                        options={membersState.members || []}
                        value={payingMemberId ? getMemberById(payingMemberId) : null}
                        onChange={(_, newValue) => setPayingMemberId(newValue?.id || null)}
                        getOptionLabel={(option) => getMemberDisplayValue(option)}
                        open={autocompleteOpen}
                        onOpen={() => setAutocompleteOpen(true)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t("PAYING_MEMBER")}
                            />
                        )}
                    />
                );
            default:
                return null;
        }
    }

    const renderedInputName = getInputToRender();

    function renderPaymentPreview() {
        return (
            <Grid sx={{ fontSize: "1.4rem" }}>
                {paymentReceiverId && (
                    <Grid>
                        <strong>{t("PAYMENT_RECEIVER")}</strong>: {displayMember(paymentReceiverId)}
                    </Grid>
                )}
                {paymentMethod && (
                    <Grid>
                        <strong>{t("PAYMENT_METHOD")}</strong>: {getPaymentMethodDisplayValue(paymentMethod)}
                    </Grid>
                )}
                {payingMemberId && (
                    <Grid>
                        <strong>{t("PAYING_MEMBER")}</strong>: {displayMember(payingMemberId)}
                    </Grid>
                )}
            </Grid>
        );
    }

    const isSubmitEnabled = () => {
        return Boolean((paymentMethod && paymentReceiverId) || payingMemberId);
    };

    if (!action) {
        return null;
    }

    return (
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
                            <Grid container sx={{ fontSize: "1.4rem" }}>
                                <Grid item xs={3}>
                                    <strong>{t(renderedInputName)}: </strong>
                                </Grid>
                                <Grid item xs={9}>
                                    {renderInput(renderedInputName)}
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                    <Grid xs={4} />
                </Grid>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid xs={9} />
                    <Grid xs={3}>
                        <div style={{ display: "flex", gap: 4 }}>
                            <Button
                                color="error"
                                variant="contained"
                                size="large"
                                sx={{
                                    fontWeight: "bold",
                                    fontSize: "1.25rem",
                                }}
                                onClick={onClose}
                            >
                                {t("CANCEL")}
                            </Button>
                            <Button
                                variant="contained"
                                size="large"
                                sx={{
                                    fontWeight: "bold",
                                    fontSize: "1.25rem",
                                }}
                                onClick={() => {
                                    if (!confirm(t("CLEAR_CONFIRMATION"))) {
                                        return;
                                    }
                                    setPaymentReceiverId(null);
                                    setPaymentMethod(null);
                                    setPayingMemberId(null);
                                }}
                            >
                                {t("CLEAR")}
                            </Button>
                            <Button
                                color="primary"
                                variant="contained"
                                size="large"
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
                                })}
                            >
                                {t("CONFIRM")}
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    );
}
