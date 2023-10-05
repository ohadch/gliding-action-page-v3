import {Grid} from "@mui/material";
import NotificationsTable from "../../components/notifications/NotificationsTable.tsx";
import {useTranslation} from "react-i18next";

export default function NotificationsPage() {
    const {t} = useTranslation()
    return (
        <Grid>
            <Grid>
                <h1>{t("NOTIFICATIONS")}</h1>
            </Grid>
            <NotificationsTable/>
        </Grid>
    )
}
