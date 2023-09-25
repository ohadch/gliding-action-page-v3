import {Card, CardContent, CardHeader} from "@mui/material";
import {useTranslation} from "react-i18next";

export default function ActionConfigurationComponent() {
    const {t} = useTranslation();
    return (
        <Card>
            <CardHeader>
                {t("ACTION_CONFIGURATION")}
            </CardHeader>
            <CardContent>
                Test
            </CardContent>
        </Card>
    )
}
