import {Autocomplete, FormControl, FormGroup, Grid, TextField} from "@mui/material";
import {useTranslation} from "react-i18next";
import {getMemberDisplayValue} from "../../utils/display.ts";
import {useCallback} from "react";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../store";
import {updateAction} from "../../store/actions/action.ts";

export default function ActionConfigurationComponent() {
    const {t} = useTranslation();
    const membersStoreState = useSelector((state: RootState) => state.members)
    const action = useSelector((state: RootState) => state.actions.actions?.find((action) => action.id === state.currentAction.actionId))
    const getMemberById = useCallback((id: number) => membersStoreState.members?.find((member) => member.id === id), [membersStoreState.members]);
    const dispatch = useAppDispatch();

    if (!action) {
        return null;
    }

    const {field_responsible_id, responsible_cfi_id} = action;

    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <FormGroup>
                    <FormControl>
                        <Autocomplete
                            id="field-responsible"
                            options={membersStoreState.members || []}
                            value={field_responsible_id ? getMemberById(field_responsible_id) : null}
                            onChange={(_, newValue) => dispatch(
                                updateAction({
                                    actionId: action.id,
                                    updatePayload: {
                                        field_responsible_id: newValue?.id
                                    }
                                })
                            )}
                            getOptionLabel={(option) => getMemberDisplayValue(
                                option,
                                membersStoreState.membersRoles?.filter((role) => role.member_id === option.id) || [],
                                true
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
            <Grid item xs={6}>
                <FormGroup>
                    <FormControl>
                        <Autocomplete
                            id="responsible-cfi"
                            options={membersStoreState.members || []}
                            value={responsible_cfi_id ? getMemberById(responsible_cfi_id) : null}
                            onChange={(_, newValue) => dispatch(
                                updateAction({
                                    actionId: action.id,
                                    updatePayload: {
                                        responsible_cfi_id: newValue?.id
                                    }
                                })
                            )}
                            getOptionLabel={(option) => getMemberDisplayValue(
                                option,
                                membersStoreState.membersRoles?.filter((role) => role.member_id === option.id) || [],
                                true
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
        </Grid>
    )
}
