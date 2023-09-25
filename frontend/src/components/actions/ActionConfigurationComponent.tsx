import {Autocomplete, FormControl, FormGroup, Grid, TextField} from "@mui/material";
import {useTranslation} from "react-i18next";
import {getGliderDisplayValue, getMemberDisplayValue} from "../../utils/display.ts";
import {useCallback} from "react";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../store";
import {updateAction} from "../../store/actions/action.ts";
import {isCfi} from "../../utils/members.ts";

export default function ActionConfigurationComponent() {
    const {t} = useTranslation();
    const membersStoreState = useSelector((state: RootState) => state.members)
    const glidersStoreState = useSelector((state: RootState) => state.gliders)
    const action = useSelector((state: RootState) => state.actions.actions?.find((action) => action.id === state.currentAction.actionId))
    const getMemberById = useCallback((id: number) => membersStoreState.members?.find((member) => member.id === id), [membersStoreState.members]);
    const dispatch = useAppDispatch();

    if (!action) {
        return null;
    }

    const {field_responsible_id, responsible_cfi_id, instruction_glider_id} = action;

    return (
        <Grid container spacing={2}>
            <Grid item xs={4}>
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
            <Grid item xs={4}>
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
            <Grid item xs={4}>
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
        </Grid>
    )
}
