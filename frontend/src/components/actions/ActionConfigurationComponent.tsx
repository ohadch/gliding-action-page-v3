import {
    Autocomplete, Checkbox,
    Chip,
    FormControl,
    FormGroup,
    Grid, InputLabel, ListItemText,
    MenuItem, OutlinedInput,
    Select, SelectChangeEvent,
    TextField,
    Typography,
    IconButton,
} from "@mui/material";
import {useTranslation} from "react-i18next";
import {getMemberDisplayValue, getTowAirplaneDisplayValue} from "../../utils/display.ts";
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
} from "../../store/actions/action.ts";
import {createEvent} from "../../store/actions/event.ts";
import {MemberSchema} from "../../lib/types.ts";
import {Close} from "@mui/icons-material";

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
    const towAirplanesStoreState = useSelector((state: RootState) => state.towAirplanes)
    const action = useSelector((state: RootState) => state.actions.actions?.find((action) => action.id === state.actions.actionId))
    const currentActionStoreState = useSelector((state: RootState) => state.actions)
    const getMemberById = useCallback((id: number) => membersStoreState.members?.find((member) => member.id === id), [membersStoreState.members]);
    const getTowAirplaneById = useCallback((id: number) => towAirplanesStoreState.towAirplanes?.find((towAirplane) => towAirplane.id === id), [towAirplanesStoreState.towAirplanes]);
    const dispatch = useAppDispatch();
    const [editedActiveTowAirplaneId, setEditedActiveTowAirplaneId] = useState<number | null>(null);

    useEffect(() => {
        if (!action) {
            return
        }

        if (!currentActionStoreState.activeTowAirplanes) {
            dispatch(
                fetchActiveTowAirplanes(action?.id)
            )
        }
    }, [
        currentActionStoreState.activeTowAirplanes,
        dispatch,
        action
    ]);

    if (!action) {
        return null;
    }

    const {field_responsible_id, responsible_cfi_id} = action;

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
            const towAirplaneInTowFlight = currentActionStoreState?.flights?.find((flight) => flight.tow_airplane_id === removedTowAirplaneId && flight.state === "Tow")

            if (towAirplaneInTowFlight) {
                const towAirplane = towAirplanesStoreState.towAirplanes?.find((towAirplane) => towAirplane.id === removedTowAirplaneId)

                if (!towAirplane) {
                    return
                }

                alert(`${t("CANNOT_DEACTIVATE_TOW_AIRPLANE_DURING_TOW")}: ${getTowAirplaneDisplayValue(towAirplane)}`)
                return
            }

            const activationId = currentActionStoreState.activeTowAirplanes?.find((activeTowAirplane) => activeTowAirplane.airplane_id === removedTowAirplaneId)?.id
            if (action?.id && activationId) {
                const removedTowAirplane = towAirplanesStoreState.towAirplanes?.find((towAirplane) => towAirplane.id === removedTowAirplaneId)
                const removedTowPilot = getMemberById(currentActionStoreState.activeTowAirplanes?.find((activeTowAirplane) => activeTowAirplane.airplane_id === removedTowAirplaneId)?.tow_pilot_id || 0)

                if (removedTowAirplane && removedTowPilot) {
                    if (!confirm(`${t("DEACTIVATE_TOW_AIRPLANE_CONFIRMATION")} ${getTowAirplaneDisplayValue(removedTowAirplane)} (${getMemberDisplayValue(removedTowPilot)})`)) {
                        return
                    }
                }

                dispatch(
                    createEvent({
                        action_id: action.id,
                        type: "tow_airplane_deactivated",
                        payload: {
                            tow_airplane_id: removedTowAirplaneId,
                            tow_pilot_id: currentActionStoreState.activeTowAirplanes?.find((activeTowAirplane) => activeTowAirplane.airplane_id === removedTowAirplaneId)?.tow_pilot_id,
                            field_responsible_id: action?.field_responsible_id,
                        }
                    })
                )

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

    const activeTowPilotIds = currentActionStoreState?.activeTowAirplanes?.map((activeTowAirplane) => activeTowAirplane.tow_pilot_id) || []

    function getFieldResponsibleOptions() {
        const initialOptions = membersStoreState.members || []

        return initialOptions.filter(member => ![
            ...activeTowPilotIds,
            responsible_cfi_id
        ].includes(member.id))
    }

    function getResponsibleCfiOptions() {
        const initialOptions = membersStoreState.members || []

        return initialOptions.filter(member => ![
            ...activeTowPilotIds,
            field_responsible_id
        ].includes(member.id) && isCfi(member, membersStoreState.membersRoles || []))
    }

    function displayTowPilotByAirplaneId(airplaneId: number) {
        const activeTowAirplane = currentActionStoreState.activeTowAirplanes?.find((activeTowAirplane) => activeTowAirplane.airplane_id === airplaneId);
        const towPilot = activeTowAirplane?.tow_pilot_id ? getMemberById(activeTowAirplane.tow_pilot_id) : null;
        return towPilot ? getMemberDisplayValue(towPilot) : "";
    }

    function onFieldResponsibleChanged(newValue: MemberSchema | null) {
        if (!confirm(t("UPDATE_FIELD_RESPONSIBLE_CONFIRMATION"))) {
            return
        }

        if (!action) {
            return
        }

        if (newValue?.id === field_responsible_id) {
            return
        }

        if (field_responsible_id) {
            dispatch(createEvent({
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                action_id: action.id,
                type: "field_responsible_unassigned",
                payload: {
                    field_responsible_id
                }
            }))
        }

        dispatch(
            updateAction({
                actionId: action.id,
                updatePayload: {
                    ...action,
                    field_responsible_id: newValue?.id
                }
            })
        )

        if (newValue?.id) {
            dispatch(createEvent({
                action_id: action.id,
                type: "field_responsible_assigned",
                payload: {
                    field_responsible_id: newValue?.id,
                }
            }))
        }
    }

    function onResponsibleCfiChanged(newValue: MemberSchema | null) {
        if (!confirm(t("UPDATE_RESPONSIBLE_CFI_CONFIRMATION"))) {
            return
        }

        if (!action) {
            return
        }

        if (newValue?.id === responsible_cfi_id) {
            return
        }

        if (responsible_cfi_id) {
            dispatch(createEvent({
                action_id: action.id,
                type: "responsible_cfi_unassigned",
                payload: {
                    responsible_cfi_id,
                    field_responsible_id: action?.field_responsible_id,
                }
            }))
        }

        dispatch(
            updateAction({
                actionId: action.id,
                updatePayload: {
                    ...action,
                    responsible_cfi_id: newValue?.id
                }
            })
        )

        if (newValue?.id) {
            dispatch(createEvent({
                action_id: action.id,
                type: "responsible_cfi_assigned",
                payload: {
                    responsible_cfi_id: newValue?.id,
                    field_responsible_id: action?.field_responsible_id,
                }
            }))
        }
    }

    return (
        <>
            {editedActiveTowAirplaneId && <EditActiveTowAirplanesDialog
                towAirplaneId={editedActiveTowAirplaneId}
                open={Boolean(editedActiveTowAirplaneId)}
                onCancel={() => setEditedActiveTowAirplaneId(null)}
                onSubmit={(towPilotId) => {
                    dispatch(
                        createEvent({
                            action_id: action.id,
                            type: "tow_airplane_activated",
                            payload: {
                                tow_airplane_id: editedActiveTowAirplaneId,
                                tow_pilot_id: towPilotId,
                                field_responsible_id: action?.field_responsible_id,
                            }
                        })
                    )

                    dispatch(
                        addActiveTowAirplane({
                            action_id: action.id,
                            airplane_id: editedActiveTowAirplaneId,
                            tow_pilot_id: towPilotId,
                        })
                    )
                    setEditedActiveTowAirplaneId(null)
                }}
            />}
            <Grid container spacing={1}>
                <Grid item xs={4}>
                    <FormControl fullWidth sx={{ height: '56px' }}>
                        <Autocomplete
                            id="field-responsible"
                            disabled={Boolean(action?.closed_at)}
                            value={field_responsible_id ? getMemberById(field_responsible_id) : null}
                            onChange={(_, newValue) => onFieldResponsibleChanged(newValue)}
                            options={getFieldResponsibleOptions()}
                            getOptionLabel={getMemberDisplayValue}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t("FIELD_RESPONSIBLE")}
                                />
                            )}
                            sx={{ 
                                '& .MuiInputBase-root': {
                                    height: '56px'
                                }
                            }}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl fullWidth sx={{ height: '56px' }}>
                        <Autocomplete
                            id="responsible-cfi"
                            disabled={Boolean(action?.closed_at)}
                            value={responsible_cfi_id ? getMemberById(responsible_cfi_id) : null}
                            onChange={(_, newValue) => onResponsibleCfiChanged(newValue)}
                            options={getResponsibleCfiOptions()}
                            getOptionLabel={getMemberDisplayValue}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t("RESPONSIBLE_CFI")}
                                />
                            )}
                            sx={{ 
                                '& .MuiInputBase-root': {
                                    height: '56px'
                                }
                            }}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl fullWidth sx={{ height: '56px' }}>
                        <InputLabel id="active-tow-airplanes-label">{t("ACTIVE_TOW_AIRPLANES")}</InputLabel>
                        <Select
                            disabled={Boolean(action?.closed_at)}
                            labelId="active-tow-airplanes-label"
                            id="active-tow-airplanes"
                            multiple
                            value={currentActionStoreState?.activeTowAirplanes?.map((activeTowAirplane) => activeTowAirplane.airplane_id) || []}
                            onChange={handleActiveTowAirplaneChange}
                            input={<OutlinedInput label={t("ACTIVE_TOW_AIRPLANES")} />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => {
                                        const towAirplane = getTowAirplaneById(value);
                                        const activeTowAirplane = currentActionStoreState?.activeTowAirplanes?.find(
                                            (activeTowAirplane) => activeTowAirplane.airplane_id === value
                                        );
                                        const towPilot = activeTowAirplane ? getMemberById(activeTowAirplane.tow_pilot_id) : null;
                                        return (
                                            <Chip 
                                                key={value} 
                                                label={`${towAirplane?.call_sign}${towPilot ? ` (${getMemberDisplayValue(towPilot)})` : ''}`}
                                                onDelete={() => handleDeactivateTowAirplane(value)}
                                            />
                                        );
                                    })}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                            sx={{ height: '56px' }}
                        >
                            {(towAirplanesStoreState.towAirplanes || []).map((towAirplane) => (
                                <MenuItem 
                                    key={towAirplane.id} 
                                    value={towAirplane.id}
                                    onClick={() => setEditedActiveTowAirplaneId(towAirplane.id)}
                                >
                                    <Checkbox
                                        checked={(currentActionStoreState?.activeTowAirplanes?.map((activeTowAirplane) => activeTowAirplane.airplane_id) || []).indexOf(towAirplane.id) > -1}
                                    />
                                    <ListItemText 
                                        primary={towAirplane.call_sign}
                                        secondary={displayTowPilotByAirplaneId(towAirplane.id)}
                                    />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </>
    )
}
