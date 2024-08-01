import {FlightSchema} from "../../lib/types.ts";
import {Autocomplete, Dialog, FormControl, FormGroup, Grid, TextField} from "@mui/material";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {getMemberDisplayValue} from "../../utils/display.ts";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";

export interface FlightsTableSendEmailDialogProps {
    flights: FlightSchema[];
    open: boolean;
}

export default function FlightsTableSendEmailDialog(props: FlightsTableSendEmailDialogProps) {
    const {flights, open} = props;
    const membersStoreState = useSelector((state: RootState) => state.members)
    const [memberId, setMemberId] = useState<number | null>(null);

    const getMemberById = (id: number) => membersStoreState.members?.find((member) => member.id === id);
    const {t} = useTranslation();

    return (
        <Dialog open={open} maxWidth="xl">
            <Grid>
                <Typography variant="h5">{t("SEND_EMAIL")}: {flights.length} {t("FLIGHTS")}</Typography>
            </Grid>
            <Grid>
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
                                            label={t("MEMBER")}
                                        />
                                    )
                                }}
                            />
                        </FormControl>
                    </FormGroup>
            </Grid>
        </Dialog>
    );
}
