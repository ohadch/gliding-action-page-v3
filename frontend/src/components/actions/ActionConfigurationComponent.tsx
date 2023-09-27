import {
    Autocomplete, Checkbox,
    Chip,
    FormControl,
    FormGroup,
    Grid, InputLabel, ListItemText,
    MenuItem, OutlinedInput,
    Select, SelectChangeEvent,
    TextField,
} from "@mui/material";
import {useTranslation} from "react-i18next";
import {getGliderDisplayValue, getMemberDisplayValue, getTowAirplaneDisplayValue} from "../../utils/display.ts";
import {useCallback, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../store";
import {updateAction} from "../../store/actions/action.ts";
import {isCfi} from "../../utils/members.ts";
import Box from "@mui/material/Box";
import EditActiveTowAirplanesDialog from "./EditActiveTowAirplanesDialog.tsx";
import {
    addActiveTowAirplane,
    deleteActiveTowAirplane,
    fetchActiveTowAirplanes
} from "../../store/actions/currentAction.ts";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export default function ActionConfigurationComponent() {
    const {t} = useTranslation();
    const membersStoreState = useSelector((state: RootState) => state.members)
    const glidersStoreState = useSelector((state: RootState) => state.gliders)
    const towAirplanesStoreState = useSelector((state: RootState) => state.towAirplanes)
    const action = useSelector((state: RootState) => state.actions.actions?.find((action) => action.id === state.currentAction.actionId))
    const currentActionStoreState = useSelector((state: RootState) => state.currentAction)
    const getMemberById = useCallback((id: number) => membersStoreState.members?.find((member) => member.id === id), [membersStoreState.members]);
    const dispatch = useAppDispatch();
    const [editedActiveTowAirplaneId, setEditedActiveTowAirplaneId] = useState<number | null>(null);


    if (!action) {
        return null;
    }

    useEffect(() => {
        if (!currentActionStoreState.activeTowAirplanes) {
            dispatch(
                fetchActiveTowAirplanes(action?.id)
            )
        }
    }, []);


    const {field_responsible_id, responsible_cfi_id, instruction_glider_id} = action;

    function handleActiveTowAirplaneChange(event: SelectChangeEvent<number[]>) {
        const {
            target: {value},
        } = event;

        const towAirplaneIdsAfterChange: number[] = typeof value === 'string' ? value.split(',').map(val => parseFloat(val)) : value
        const activeTowAirplanes = currentActionStoreState?.activeTowAirplanes?.map((activeTowAirplane) => activeTowAirplane.airplane_id) || []
        const addedTowAirplaneId = towAirplaneIdsAfterChange.find(towAirplaneId => !activeTowAirplanes.includes(towAirplaneId))
        const removedTowAirplaneId = activeTowAirplanes.find(towAirplaneId => !towAirplaneIdsAfterChange.includes(towAirplaneId))

        if (addedTowAirplaneId) {
            setEditedActiveTowAirplaneId(addedTowAirplaneId)
        } else if (removedTowAirplaneId) {
            const activationId = currentActionStoreState.activeTowAirplanes?.find((activeTowAirplane) => activeTowAirplane.airplane_id === removedTowAirplaneId)?.id
            if (activationId) {
                dispatch(
                    deleteActiveTowAirplane(activationId)
                )
            }
        }

    }

    function renderTowAirplane(towAirplaneId: number) {
        const activeTowAirplane = currentActionStoreState.activeTowAirplanes?.find((activeTowAirplane) => activeTowAirplane.airplane_id === towAirplaneId);
        const towAirplane = towAirplanesStoreState.towAirplanes?.find((towAirplane) => towAirplane.id === towAirplaneId);
        const towPilot = activeTowAirplane?.tow_pilot_id ? getMemberById(activeTowAirplane.tow_pilot_id) : null;


        const towAirplaneLabel = towAirplane ? getTowAirplaneDisplayValue(towAirplane) : null;
        const towPilotLabel = towPilot ? `(${getMemberDisplayValue(towPilot)})` : null;
        const label = [towAirplaneLabel, towPilotLabel].filter((label) => label).join(" ");

        return (
            <Chip key={towAirplaneId} label={label}/>
        )

    }

    return (
        <>
            {editedActiveTowAirplaneId && <EditActiveTowAirplanesDialog
                towAirplaneId={editedActiveTowAirplaneId}
                open={Boolean(editedActiveTowAirplaneId)}
                onCancel={() => setEditedActiveTowAirplaneId(null)}
                onSubmit={(towPilotId) => {
                    dispatch(
                        addActiveTowAirplane({
                            action_id: action.id,
                            airplane_id: editedActiveTowAirplaneId,
                            tow_pilot_id: towPilotId
                        })
                    )
                    setEditedActiveTowAirplaneId(null)
                }}
            />}
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <FormGroup>
                        <FormControl>
                            <Autocomplete
                                id="field-responsible"
                                options={membersStoreState.members || []}
                                value={(field_responsible_id ? getMemberById(field_responsible_id) : null) || null}
                                onChange={(_, newValue) => dispatch(
                                    updateAction({
                                        actionId: action.id,
                                        updatePayload: {
                                            ...action,
                                            field_responsible_id: newValue?.id
                                        }
                                    })
                                )}
                                getOptionLabel={(option) => getMemberDisplayValue(
                                    option,
                                )}
                                renderInput={(params) => {
                                    return (
                                        <TextField
                                            {...params}
                                            label={t("FIELD_RESPONSIBLE")}
                                        />
                                    )
                                }}
                            />
                        </FormControl>
                    </FormGroup>
                </Grid>
                <Grid item xs={3}>
                    <FormGroup>
                        <FormControl>
                            <Autocomplete
                                id="responsible-cfi"
                                options={(membersStoreState.members || []).filter(member => isCfi(member, membersStoreState.membersRoles || []))}
                                value={(responsible_cfi_id ? getMemberById(responsible_cfi_id) : null) || null}
                                onChange={(_, newValue) => dispatch(
                                    updateAction({
                                        actionId: action.id,
                                        updatePayload: {
                                            ...action,
                                            responsible_cfi_id: newValue?.id
                                        }
                                    })
                                )}
                                getOptionLabel={(option) => getMemberDisplayValue(
                                    option,
                                )}
                                renderInput={(params) => {
                                    return (
                                        <TextField
                                            {...params}
                                            label={t("RESPONSIBLE_CFI")}
                                        />
                                    )
                                }}
                            />
                        </FormControl>
                    </FormGroup>
                </Grid>
                <Grid item xs={2}>
                    <FormGroup>
                        <FormControl>
                            <Autocomplete
                                id="instruction-glider"
                                options={(glidersStoreState.gliders || []).filter(glider => glider.num_seats == 2 && !glidersStoreState.ownerships?.some(ownership => ownership.glider_id === glider.id))}
                                value={(instruction_glider_id ? glidersStoreState.gliders?.find((glider) => glider.id === instruction_glider_id) : null) || null}
                                onChange={(_, newValue) => dispatch(
                                    updateAction({
                                        actionId: action.id,
                                        updatePayload: {
                                            ...action,
                                            instruction_glider_id: newValue?.id
                                        }
                                    })
                                )}
                                getOptionLabel={(option) => getGliderDisplayValue(option)}
                                renderInput={(params) => {
                                    return (
                                        <TextField
                                            {...params}
                                            label={t("INSTRUCTION_GLIDER")}
                                        />
                                    )
                                }}
                            />
                        </FormControl>
                    </FormGroup>
                </Grid>
                <Grid item xs={4}>
                    <FormGroup>
                        <FormControl>
                            <InputLabel id="active-tow-airplanes-label">{t("ACTIVE_TOW_AIRPLANES")}</InputLabel>
                            <Select
                                labelId="active-tow-airplanes-label"
                                id="active-tow-airplanes"
                                multiple
                                value={currentActionStoreState?.activeTowAirplanes?.map((activeTowAirplane) => activeTowAirplane.airplane_id) || []}
                                onChange={(event) => handleActiveTowAirplaneChange(event)}
                                input={<OutlinedInput label="Tag"/>}
                                renderValue={(selected) => (
                                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                        {selected.map((value) => renderTowAirplane(value))}
                                    </Box>
                                )}
                                MenuProps={MenuProps}
                            >
                                {(towAirplanesStoreState.towAirplanes || []).map((towAirplane) => (
                                    <MenuItem key={towAirplane.id} value={towAirplane.id}>
                                        <Checkbox
                                            checked={(currentActionStoreState?.activeTowAirplanes?.map((activeTowAirplane) => activeTowAirplane.airplane_id) || []).indexOf(towAirplane.id) > -1}/>
                                        <ListItemText primary={towAirplane.call_sign}/>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </FormGroup>
                </Grid>
            </Grid>
        </>
    )
}
