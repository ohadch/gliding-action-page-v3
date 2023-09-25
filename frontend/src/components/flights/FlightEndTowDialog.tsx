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

export default function FlightEndTowDialog({flight, open, onCancel, onSubmit}: FlightEndTowDialogProps) {
    const action = useSelector((state: RootState) => state.actions.actions?.find((action) => action.id === state.currentAction.actionId))

    const {
        t
    } = useTranslation()


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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Dialog open={open} maxWidth="xl">
            <DialogTitle sx={{
                display: "flex",
                justifyContent: "space-between",
            }}>
                <div>{t("CREATE_FLIGHT")}</div>
                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                }}>
                    <Button onClick={onCancel}>
                        {t("CANCEL")}
                    </Button>
                    <Button onClick={() => {
                        if (!confirm(t("CLEAR_CONFIRMATION"))) {
                            return
                        }

                        setTowType(null);
                    }}>
                        {t("CLEAR")}
                    </Button>
                    <Button
                        disabled={!isSubmitEnabled()}
                        onClick={() => onSubmit({
                            ...flight,
                            state: "Inflight",
                            tow_type: towType,
                            tow_release_at: flight.tow_release_at || moment().utcOffset(0, true).toISOString()
                        })}>
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
