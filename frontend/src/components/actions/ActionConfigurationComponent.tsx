import {
    Autocomplete,
    Card,
    CardContent,
    FormControl,
    FormGroup,
    TextField
} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../store";
import {useEffect} from "react";
import {fetchMembers} from "../../store/actions/member.ts";
import {MemberSchema} from "../../lib/types.ts";
import {setFieldResponsibleId, setResponsibleCfiId} from "../../store/reducers/actionSlice.ts";

export default function ActionConfigurationComponent() {
    const {t} = useTranslation()
    const { fetchInProgress, members } = useSelector((state: RootState) => state.members)
    const { responsibleCfiId, fieldResponsibleId } = useSelector((state: RootState) => state.actions)
    const dispatch = useAppDispatch();

    const getMemberById = (id: number) => members?.find(member => member.id === id) || null

    useEffect(() => {
        if (!members && !fetchInProgress) {
            dispatch(fetchMembers());
        }
    });

    if (!members) {
        return null
    }

    return (
        <Card>
            <CardContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <FormGroup>
                    <FormControl>
                        <Autocomplete
                            id="field-responsible"
                            options={members}
                            value={fieldResponsibleId ? getMemberById(fieldResponsibleId) : null}
                            onChange={(_, newValue) => newValue ? dispatch(setFieldResponsibleId(newValue.id)) : dispatch(setFieldResponsibleId(undefined))}
                            getOptionLabel={(option: MemberSchema) => `${option.first_name} ${option.last_name}`}
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
                <FormGroup>
                    <FormControl>
                        <Autocomplete
                            id="responsible-cfi"
                            options={members}
                            value={responsibleCfiId ? getMemberById(responsibleCfiId) : null}
                            onChange={(_, newValue) => newValue ? dispatch(setResponsibleCfiId(newValue.id)) : dispatch(setResponsibleCfiId(undefined))}
                            getOptionLabel={(option: MemberSchema) => `${option.first_name} ${option.last_name}`}
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
            </CardContent>
        </Card>
    )
}
