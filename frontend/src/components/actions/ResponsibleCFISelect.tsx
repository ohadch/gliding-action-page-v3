import { Autocomplete, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { MemberSchema } from "../../lib/types";
import { getMemberDisplayValue } from "../../utils/display";

interface ResponsibleCFISelectProps {
    value: MemberSchema | null;
    onChange: (newValue: MemberSchema | null) => void;
    options: MemberSchema[];
    disabled?: boolean;
}

export function ResponsibleCFISelect({ value, onChange, options, disabled }: ResponsibleCFISelectProps) {
    const { t } = useTranslation();

    // Find the matching option from the options array
    const selectedOption = value ? options.find(option => option.id === value.id) || null : null;

    return (
        <Autocomplete
            value={selectedOption}
            onChange={(_, newValue) => onChange(newValue)}
            options={options}
            getOptionLabel={getMemberDisplayValue}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={t("RESPONSIBLE_CFI")}
                />
            )}
            disabled={disabled}
        />
    );
} 