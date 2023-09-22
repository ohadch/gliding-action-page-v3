import {Button, Grid} from "@mui/material";
import FlightsTable from "../../components/flights/FlightsTable.tsx";
import {useState} from "react";
import Box from "@mui/material/Box";
import {useTranslation} from "react-i18next";
import CreateOrUpdateFlightDialog from "../../components/flights/CreateOrUpdateFlightDialog.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../store";

export default function DashboardPage() {
    const [createFlightDialogOpen, setCreateFlightDialogOpen] = useState<boolean>(false);
    const {t} = useTranslation();
    const { flights } = useSelector((state: RootState) => state.actions);


    return (
        <>
            <CreateOrUpdateFlightDialog
                open={createFlightDialogOpen}
                onCancel={() => setCreateFlightDialogOpen(false)}
                onSubmit={() => alert("TODO")}
            />

            <Grid container spacing={2}>
                <Grid xs={12} mb={2}>
                    <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                        <Button variant="contained" color="primary" onClick={() => setCreateFlightDialogOpen(true)}>
                            {t("NEW_FLIGHT")}
                        </Button>
                    </Box>
                </Grid>


                {flights && <FlightsTable flights={flights}/>}
            </Grid>
        </>
    )
}
