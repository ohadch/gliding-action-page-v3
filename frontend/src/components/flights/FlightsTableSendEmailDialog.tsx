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
import Typography from "@mui/material/Typography";
import {createEvent} from "../../store/actions/event.ts";

export interface FlightsTableSendEmailDialogProps {
    flights: FlightSchema[];
    open: boolean;
}

export default function FlightsTableSendEmailDialog(props: FlightsTableSendEmailDialogProps) {
    const {flights, open} = props;
    const membersStoreState = useSelector((state: RootState) => state.members)
    const [memberId, setMemberId] = useState<number | null>(null);
    const dispatch = useAppDispatch();

    const getMemberById = (id: number) => membersStoreState.members?.find((member) => member.id === id);
    const {t} = useTranslation();

    function onSendEmail() {
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

        // dispatch(createEvent({
        //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //     // @ts-ignore
        //     action_id: action.id,
        //     type: "send_report_email_requested",
        //     payload: {
        //         flights
        //     }
        // }))
    }

    return (
        <Dialog open={open} maxWidth="xl">
            <DialogTitle>
                <Typography variant="h5">{t("SEND_EMAIL")}: {flights.length} {t("FLIGHTS")}</Typography>
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
                        <Button size={"large"} variant={"outlined"} color={"primary"} onClick={onSendEmail}>
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
