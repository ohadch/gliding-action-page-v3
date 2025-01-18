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
import {useState} from "react";
import {
    FlightSchema,
    FlightUpdateSchema, TowType,
} from "../../lib/types.ts";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {
    getTowTypeDisplayValue,
} from "../../utils/display.ts";
import {SUPPORTED_TOW_TYPES} from "../../utils/consts.ts";
import moment from "moment/moment";

enum RenderedInputName {
    TOW_TYPE = "TOW_TYPE",
}

export interface FlightEndTowDialogProps {
    flight: FlightSchema;
    open: boolean
    onCancel: () => void
    onSubmit: (flight: FlightUpdateSchema) => void
}

export default function FlightEndTowDialog({
    flight,
    open,
    onCancel,
    onSubmit
}: FlightEndTowDialogProps) {
    console.log('FlightEndTowDialog render:', { flight, open });
    const { t } = useTranslation();
    
    const action = useSelector((state: RootState) => 
        state.actionDays.list.actions?.find(
            (action) => action.id === state.actionDays.currentDay.currentActionId
        )
    );

    const [towType, setTowType] = useState<TowType | null | undefined>(flight.tow_type);
    const [autocompleteOpen, setAutocompleteOpen] = useState(true);

    function getInputToRender() {
        if (!towType) {
            return RenderedInputName.TOW_TYPE;
        }

        return null;
    }


    function renderInput(inputName: RenderedInputName) {
        switch (inputName) {
            case RenderedInputName.TOW_TYPE:
                return (
                    <FormGroup>
                        <FormControl>
                            <Autocomplete
                                id="tow-type"
                                options={SUPPORTED_TOW_TYPES}
                                value={towType}
                                getOptionLabel={(option: TowType) => getTowTypeDisplayValue(option)}
                                open={autocompleteOpen}
                                onOpen={() => setAutocompleteOpen(true)}
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
                )
            default:
                return null;
        }
    }

    const renderedInputName = getInputToRender();

    function renderFlightPreview() {
        return (
            <Grid>
                {towType && (
                    <Grid>
                        <strong>{t("TOW_TYPE")}</strong>: {getTowTypeDisplayValue(towType)}
                    </Grid>
                )}
            </Grid>
        )
    }

    const isSubmitEnabled = () => {
        const conditions: boolean[] = [
            Boolean(towType),
        ]

        return conditions.every(Boolean)
    }

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
                gap: 4
            }}>
                <div>{t("SELECT_TOW_TYPE")}</div>
                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 4
                }}>
                    <Button
                        color="error"
                        variant="contained"
                        size="large"
                        sx={{
                            fontWeight: "bold",
                            fontSize: "1.25rem",
                        }}
                        onClick={onCancel}
                    >
                        {t("CANCEL")}
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
                            state: "Inflight",
                            tow_type: towType,
                            tow_release_at: moment().utcOffset(0, true).set({
                                date: moment(action?.date).date(),
                                month: moment(action?.date).month(),
                                year: moment(action?.date).year(),
                            }).toISOString(),
                        })}
                    >
                        {t("CONFIRM")}
                    </Button>
                </div>
            </DialogTitle>
            <DialogContent>
                {renderFlightPreview()}
                <Grid sx={{
                    mt: 2,
                    width: 400,
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
