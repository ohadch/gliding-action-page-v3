import EventsTable from "../../components/events/EventsTable.tsx";
import {Grid} from "@mui/material";
import {useTranslation} from "react-i18next";

export default function EventsPage() {
    const {t} = useTranslation()
    return (
        <Grid>
            <Grid>
                <h1>{t("EVENTS")}</h1>
            </Grid>
            <EventsTable/>
        </Grid>
    )
}
