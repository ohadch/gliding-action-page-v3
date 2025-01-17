import { FormControl, Autocomplete, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { MemberSchema } from "../../lib/types";
import { getMemberDisplayValue } from "../../utils/display";

interface FieldResponsibleSelectProps {
    value: MemberSchema | null;
    onChange: (member: MemberSchema | null) => void;
    options: MemberSchema[];
    disabled: boolean;
}

export function FieldResponsibleSelect({ value, onChange, options, disabled }: FieldResponsibleSelectProps) {
    const { t } = useTranslation();

    return (
        <FormControl fullWidth sx={{ height: '56px' }}>
            <Autocomplete
                id="field-responsible"
                disabled={disabled}
                value={value}
                onChange={(_, newValue) => onChange(newValue)}
                options={options}
                getOptionLabel={(option) => getMemberDisplayValue(option)}
                isOptionEqualToValue={(option, value) => 
                    option?.id === value?.id
                }
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
    );
} 