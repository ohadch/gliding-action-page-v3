import {FlightSchema} from "../../lib/types.ts";
import {
    Autocomplete,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    FormGroup,
    Grid,
    TextField
} from "@mui/material";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../store";
import {getMemberDisplayValue} from "../../utils/display.ts";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {createEvent} from "../../store/actions/event.ts";

export interface FlightsTableSendEmailDialogProps {
    flights: FlightSchema[];
    open: boolean;
    onClose: () => void;
}

export default function FlightsTableSendEmailDialog(props: FlightsTableSendEmailDialogProps) {
    const {flights, open, onClose} = props;
    const membersStoreState = useSelector((state: RootState) => state.members)
    const currentActionState = useSelector((state: RootState) => state.actions)
    const [memberId, setMemberId] = useState<number | null>(null);
    const dispatch = useAppDispatch();

    const getMemberById = (id: number) => membersStoreState.members?.find((member) => member.id === id);
    const {t} = useTranslation();

    function onSendEmail() {
        if (!currentActionState.actionId) {
            return;
        }

        if (!memberId) {
            return;
        }

        const member = getMemberById(memberId);

        if (!member) {
            return;
        }

        if (!confirm(`${t("CONFIRM_SEND_EMAIL")}? ${t("RECIPIENT")} ${getMemberDisplayValue(member)}, ${t("EMAIL_ADDRESS")} ${member.email}`)) {
            return;
        }

        dispatch(createEvent({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            action_id: currentActionState.actionId,
            type: "flights_email_report_requested",
            payload: {
                flights_ids: flights.map((flight) => flight.id),
                recipient_member_id: member.id,
            }
        }))

        alert(t("EMAIL_SENT_SUCCESSFULLY"));

        onClose();
    }

    return (
        <Dialog open={open} maxWidth="xl">
            <DialogTitle
                sx={{
                fontSize: "2rem",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between",
            }}
            >
                {t("SEND_EMAIL")}: {flights.length} {t("FLIGHTS")}
            </DialogTitle>
            <DialogContent>
                <Grid mt={2}>
                    <FormGroup>
                        <FormControl>
                            <Autocomplete
                                id="member"
                                options={membersStoreState.members || []}
                                value={(memberId ? getMemberById(memberId) : null) || null}
                                onChange={(_, newValue) => setMemberId(newValue?.id || null)}
                                getOptionLabel={(option) => getMemberDisplayValue(
                                    option,
                                )}
                                renderInput={(params) => {
                                    return (
                                        <TextField
                                            {...params}
                                            label={t("SELECT_RECIPIENT")}
                                        />
                                    )
                                }}
                            />
                        </FormControl>
                    </FormGroup>
                </Grid>
                <Grid mt={2} sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "1rem",
                }}>
                    <Grid margin={1}>
                        <Button size={"large"} variant={"outlined"} color={"primary"} onClick={() => onClose()}>
                            {t("CANCEL")}
                        </Button>
                    </Grid>
                    <Grid margin={1}>
                        <Button size={"large"} variant={"contained"} color={"primary"} onClick={onSendEmail}>
                            {t("SEND")}
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}
