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
import { useCallback, useState } from "react";
import { FlightCreateSchema, FlightType, GliderSchema, MemberSchema } from "../../lib/types";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getFlightTypeDisplayValue, getMemberDisplayValue } from "../../utils/display";
import { SUPPORTED_FLIGHT_TYPES } from "../../utils/consts";

enum RenderedInputName {
    GLIDER = "GLIDER",
    PILOT_1 = "PILOT_1",
    PILOT_2 = "PILOT_2",
    FLIGHT_TYPE = "FLIGHT_TYPE",
}

export interface FlightCreationWizardDialogProps {
    open: boolean;
    onCancel: () => void;
    onSubmit: (flight: FlightCreateSchema) => void;
    onAdvancedEdit: (flight: FlightCreateSchema) => void;
}

export default function FlightCreationWizardDialog({
    open,
    onCancel,
    onSubmit,
    onAdvancedEdit,
}: FlightCreationWizardDialogProps) {
    const { t } = useTranslation();
    const membersState = useSelector((state: RootState) => state.members);
    const aircraftState = useSelector((state: RootState) => state.aircraft);
    const action = useSelector((state: RootState) => 
        state.actionDays.list.actions?.find(
            (action) => action.id === state.actionDays.currentDay.currentActionId
        )
    );

    const [gliderId, setGliderId] = useState<number | null>(null);
    const [pilot1Id, setPilot1Id] = useState<number | null>(null);
    const [pilot2Id, setPilot2Id] = useState<number | null>(null);
    const [flightType, setFlightType] = useState<FlightType | null>(null);
    const [autocompleteOpen, setAutocompleteOpen] = useState(true);

    const getMemberById = useCallback(
        (id: number) => membersState.members?.find((member) => member.id === id),
        [membersState.members]
    );

    const displayMember = (id: number) => {
        const member = getMemberById(id);
        return member ? getMemberDisplayValue(member) : "";
    };

    const displayGlider = (id: number) => {
        const glider = getGliderById(id);
        return glider ? glider.call_sign : "";
    };

    const getGliderById = (id: number) => 
        aircraftState.gliders?.find((glider) => glider.id === id);

    function getInputToRender() {
        if (!gliderId) {
            return RenderedInputName.GLIDER;
        }
        if (!pilot1Id) {
            return RenderedInputName.PILOT_1;
        }
        if (!pilot2Id) {
            return RenderedInputName.PILOT_2;
        }
        if (!flightType) {
            return RenderedInputName.FLIGHT_TYPE;
        }
        return null;
    }

    function getPilot1Options() {
        const initialOptions = membersState.members || [];
        return initialOptions.filter((member) => ![
            pilot2Id
        ].filter(Boolean).includes(member.id));
    }

    function getPilot2Options() {
        const initialOptions = membersState.members || [];
        return initialOptions.filter((member) => ![
            pilot1Id
        ].filter(Boolean).includes(member.id));
    }

    function renderInput(inputName: RenderedInputName) {
        switch (inputName) {
            case RenderedInputName.GLIDER:
                return (
                    <FormGroup>
                        <FormControl>
                            <Autocomplete
                                id="glider"
                                options={aircraftState.gliders || []}
                                value={gliderId ? getGliderById(gliderId) : null}
                                onChange={(_, newValue) => setGliderId(newValue?.id || null)}
                                getOptionLabel={(option: GliderSchema) => option.call_sign}
                                open={autocompleteOpen}
                                onOpen={() => setAutocompleteOpen(true)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={t("GLIDER")}
                                    />
                                )}
                            />
                        </FormControl>
                    </FormGroup>
                );
            case RenderedInputName.PILOT_1:
                return (
                    <FormGroup>
                        <FormControl>
                            <Autocomplete
                                id="pilot1"
                                options={getPilot1Options()}
                                value={pilot1Id ? getMemberById(pilot1Id) : null}
                                onChange={(_, newValue) => setPilot1Id(newValue?.id || null)}
                                getOptionLabel={(option: MemberSchema) => getMemberDisplayValue(option)}
                                open={autocompleteOpen}
                                onOpen={() => setAutocompleteOpen(true)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={t("PILOT_1")}
                                    />
                                )}
                            />
                        </FormControl>
                    </FormGroup>
                );
            case RenderedInputName.PILOT_2:
                return (
                    <FormGroup>
                        <FormControl>
                            <Autocomplete
                                id="pilot2"
                                options={getPilot2Options()}
                                value={pilot2Id ? getMemberById(pilot2Id) : null}
                                onChange={(_, newValue) => setPilot2Id(newValue?.id || null)}
                                getOptionLabel={(option: MemberSchema) => getMemberDisplayValue(option)}
                                open={autocompleteOpen}
                                onOpen={() => setAutocompleteOpen(true)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={t("PILOT_2")}
                                    />
                                )}
                            />
                        </FormControl>
                    </FormGroup>
                );
            case RenderedInputName.FLIGHT_TYPE:
                return (
                    <FormGroup>
                        <FormControl>
                            <Autocomplete
                                id="flightType"
                                options={SUPPORTED_FLIGHT_TYPES}
                                value={flightType}
                                onChange={(_, newValue) => setFlightType(newValue)}
                                getOptionLabel={(option) => getFlightTypeDisplayValue(option)}
                                open={autocompleteOpen}
                                onOpen={() => setAutocompleteOpen(true)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={t("FLIGHT_TYPE")}
                                    />
                                )}
                            />
                        </FormControl>
                    </FormGroup>
                );
            default:
                return null;
        }
    }

    const renderedInputName = getInputToRender();

    function renderFlightPreview() {
        return (
            <Grid sx={{ fontSize: "1.4rem" }}>
                {gliderId && (
                    <Grid>
                        <strong>{t("GLIDER")}</strong>: {displayGlider(gliderId)}
                    </Grid>
                )}
                {pilot1Id && (
                    <Grid>
                        <strong>{t("PILOT_1")}</strong>: {displayMember(pilot1Id)}
                    </Grid>
                )}
                {pilot2Id && (
                    <Grid>
                        <strong>{t("PILOT_2")}</strong>: {displayMember(pilot2Id)}
                    </Grid>
                )}
                {flightType && (
                    <Grid>
                        <strong>{t("FLIGHT_TYPE")}</strong>: {getFlightTypeDisplayValue(flightType)}
                    </Grid>
                )}
            </Grid>
        );
    }

    const isSubmitEnabled = () => {
        return Boolean(gliderId && pilot1Id && pilot2Id && flightType);
    };

    if (!action) {
        return null;
    }

    const createFlightPayload = (): FlightCreateSchema => ({
        action_id: action.id,
        state: "Draft",
        glider_id: gliderId,
        pilot_1_id: pilot1Id,
        pilot_2_id: pilot2Id,
        flight_type: flightType,
        take_off_at: null,
        landing_at: null,
        tow_airplane_id: null,
        tow_pilot_id: null,
        tow_release_at: null,
        tow_type: null,
        payers_type: null,
        payment_method: null,
        payment_receiver_id: null,
        paying_member_id: null,
    });

    return (
        <Dialog open={open} maxWidth="xl">
            <DialogTitle sx={{
                fontSize: "2rem",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between",
                gap: 10
            }}>
                <div>{t("CREATE_FLIGHT")}</div>
                <div style={{ display: "flex", gap: 4 }}>
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
                        variant="contained"
                        size="large"
                        sx={{
                            fontWeight: "bold",
                            fontSize: "1.25rem",
                        }}
                        onClick={() => onAdvancedEdit(createFlightPayload())}
                    >
                        {t("ADVANCED_EDIT")}
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
                        onClick={() => onSubmit(createFlightPayload())}
                    >
                        {t("CONFIRM")}
                    </Button>
                </div>
            </DialogTitle>
            <DialogContent>
                {renderFlightPreview()}
                <Grid sx={{
                    mt: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                }}>
                    {renderedInputName && (
                        <Grid sx={{
                            fontSize: "1.4rem",
                            display: "flex",
                            flexDirection: "row",
                            gap: 1,
                        }}>
                            <Grid>
                                <strong>{t(renderedInputName)}: </strong>
                            </Grid>
                            <Grid minWidth={400}>
                                {renderInput(renderedInputName)}
                            </Grid>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>
        </Dialog>
    );
}
