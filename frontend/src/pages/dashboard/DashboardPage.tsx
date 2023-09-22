import {Button, Grid} from "@mui/material";
import FlightsTable from "../../components/flights/FlightsTable.tsx";
import {useEffect, useState} from "react";
import createClient from "openapi-fetch";
import {paths} from "../../lib/api.ts";
import {FlightSchema} from "../../lib/types.ts";
import {API_HOST} from "../../utils/consts.ts";
import Box from "@mui/material/Box";
import {useTranslation} from "react-i18next";
import CreateFlightDialog from "../../components/flights/CreateFlightDialog.tsx";

const {POST} = createClient<paths>({baseUrl: API_HOST});

export default function DashboardPage() {
    const [flights, setFlights] = useState<FlightSchema[]>([]);
    const [actionId] = useState<number>(1);
    const [createFlightDialogOpen, setCreateFlightDialogOpen] = useState<boolean>(false);
    const {t} = useTranslation();

    useEffect(() => {
        (async () => {
            {
                const {data, error} = await POST("/flights/search", {
                    params: {
                        query: {
                            page: 1,
                            page_size: 200,
                        },
                    },
                    body: {
                        action_id: actionId,
                    }
                });

                if (error) {
                    console.error(error);
                }

                if (data) {
                    setFlights(data);
                }
            }
        })();
    }, [
        actionId,
    ]);


    return (
        <>
            <CreateFlightDialog
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


                <FlightsTable flights={flights}/>
            </Grid>
        </>
    )
}
