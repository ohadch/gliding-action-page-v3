import {NotificationState} from "../../lib/types.ts";
import {Chip} from "@mui/material";
import {useTranslation} from "react-i18next";

export interface NotificationStateChipProps {
    state: NotificationState
}

export default function NotificationStateChip(props: NotificationStateChipProps) {
    const {state} = props

    const {
        t
    } = useTranslation()

    switch (state) {
        case "pending":
            return (
                <Chip
                    color="info"
                    label={t("PENDING")}
                />
            )
        case "being_handled":
            return (
                <Chip
                    color="primary"
                    label={t("BEING_HANDLED")}
                />
            )
        case "sent":
            return (
                <Chip
                    color="success"
                    label={t("SENT")}
                />
            )
        case "failed":
            return (
                <Chip
                    color="error"
                    label={t("FAILED")}
                />
            )
        default:
            return (
                <Chip
                    color="error"
                    label={t("UNKNOWN")}
                />
            )
    }
}
