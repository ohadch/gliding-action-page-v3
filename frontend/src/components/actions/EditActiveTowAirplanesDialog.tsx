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
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../store";
import {fetchMembers, fetchMembersRoles} from "../../store/actions/member.ts";
import {fetchTowAirplanes} from "../../store/actions/towAirplane.ts";
import {
    getMemberDisplayValue,
} from "../../utils/display.ts";
import {isTowPilot} from "../../utils/members.ts";

enum RenderedInputName {
    GLIDER = "GLIDER",
    TOW_AIRPLANE = "TOW_AIRPLANE",
    PILOT_1 = "PILOT_1",
    PILOT_2 = "PILOT_2",
    TOW_PILOT = "TOW_PILOT",
    FLIGHT_TYPE = "FLIGHT_TYPE",
}

export interface EditActiveTowAirplaneDialogProps {
    towAirplaneId: number
    open: boolean
    onCancel: () => void
    onSubmit: (towPilotId: number) => void
}

export default function EditActiveTowAirplaneDialog({towAirplaneId, open, onSubmit, onCancel}: EditActiveTowAirplaneDialogProps) {
    const dispatch = useAppDispatch();
    const membersStoreState = useSelector((state: RootState) => state.members)
    const towAirplanesStoreState = useSelector((state: RootState) => state.towAirplanes)
    const currentActionStoreState = useSelector((state: RootState) => state.currentAction)
    const action = useSelector((state: RootState) => state.actions.actions?.find((action) => action.id === state.currentAction.actionId))
    const [newTowAirplaneId, setNewTowAirplaneId] = useState<number | null | undefined>(towAirplaneId);
    const activeTowAirplane = currentActionStoreState.activeTowAirplanes?.find((activeTowAirplane) => activeTowAirplane.id === newTowAirplaneId);
    const [towPilotId, setTowPilotId] = useState<number | null | undefined>(activeTowAirplane?.tow_pilot_id);

    const {
        t
    } = useTranslation()

    const getMemberById = useCallback((id: number) => membersStoreState.members?.find((member) => member.id === id), [membersStoreState.members]);

    const displayMember = (id: number) => {
        const member = getMemberById(id);
        return member ? getMemberDisplayValue(
            member,
        ) : "";
    }

    const displayTowAirplane = (id: number) => {
        const towAirplane = getTowAirplaneById(id);
        return towAirplane ? towAirplane.call_sign : "";
    }

    const getTowAirplaneById = (id: number) => towAirplanesStoreState.towAirplanes?.find((towAirplane) => towAirplane.id === id);
    const activeTowPilotIds = currentActionStoreState.activeTowAirplanes?.map((activeTowAirplane) => activeTowAirplane.tow_pilot_id) || []

    useEffect(() => {
        if (!membersStoreState.members && !membersStoreState.fetchInProgress) {
            dispatch(fetchMembers());
            dispatch(fetchMembersRoles());
        }
    });

    useEffect(() => {
        if (!towAirplanesStoreState.towAirplanes && !towAirplanesStoreState.fetchInProgress) {
            dispatch(fetchTowAirplanes());
        }
    });

    const [autocompleteOpen, setAutocompleteOpen] = useState(true);

    function getInputToRender() {
        if (!newTowAirplaneId) {
            return RenderedInputName.TOW_AIRPLANE;
        }

        if (!towPilotId) {
            return RenderedInputName.TOW_PILOT;
        }

        return null;
    }

    const getTowPilotOptions = () => {
        const initialOptions = membersStoreState.members || []

        const excludedOptions = [
            ...activeTowPilotIds,
            action?.field_responsible_id,
            action?.responsible_cfi_id
        ].filter(Boolean) as number[]

        return initialOptions.filter(member => !excludedOptions.includes(member.id) && isTowPilot(member, membersStoreState.membersRoles || []))
    }

    function renderInput(inputName: RenderedInputName) {
        switch (inputName) {
            case RenderedInputName.TOW_AIRPLANE:
                return (
                    <FormGroup>
                        <FormControl>
                            <Autocomplete
                                id="towAirplane"
                                options={towAirplanesStoreState.towAirplanes || []}
                                value={newTowAirplaneId ? getTowAirplaneById(newTowAirplaneId) : null}
                                onChange={(_, newValue) => setNewTowAirplaneId(newValue?.id)}
                                getOptionLabel={(option) => option.call_sign}
                                open={autocompleteOpen}
                                onOpen={() => setAutocompleteOpen(true)}
                                renderInput={(params) => {
                                    return (
                                        <TextField
                                            {...params}
                                            label={t("TOW_AIRPLANE")}
                                        />
                                    )
                                }}
                            />
                        </FormControl>
                    </FormGroup>
                )
            case RenderedInputName.TOW_PILOT:
                return (
                    <FormGroup>
                        <FormControl>
                            <Autocomplete
                                id="towPilot"
                                options={getTowPilotOptions()}
                                value={towPilotId ? getMemberById(towPilotId) : null}
                                onChange={(_, newValue) => setTowPilotId(newValue?.id)}
                                getOptionLabel={(option) => getMemberDisplayValue(
                                    option
                                )}
                                open={autocompleteOpen}
                                onOpen={() => setAutocompleteOpen(true)}
                                renderInput={(params) => {
                                    return (
                                        <TextField
                                            {...params}
                                            label={t("TOW_PILOT")}
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
                {newTowAirplaneId && (
                    <Grid>
                        <strong>{t("TOW_AIRPLANE")}</strong>: {displayTowAirplane(newTowAirplaneId)}
                    </Grid>
                )}
                {towPilotId && (
                    <Grid>
                        <strong>{t("TOW_PILOT")}</strong>: {displayMember(towPilotId)}
                    </Grid>
                )}
            </Grid>
        )
    }

    const isSubmitEnabled = () => {
        const conditions: boolean[] = [
            Boolean(newTowAirplaneId),
            Boolean(towPilotId),
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
                fontSize: "2rem",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between",
            }}>
                <div>{t("SELECT_TOW_PILOT")}</div>
                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                }}>
                    <Button onClick={onCancel}>
                        {t("CANCEL")}
                    </Button>
                    <Button
                        disabled={!isSubmitEnabled()}
                        onClick={() => towPilotId && onSubmit(towPilotId)}>
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
