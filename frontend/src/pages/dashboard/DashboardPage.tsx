import {Grid} from "@mui/material";
import FlightsTable from "../../components/flights/FlightsTable.tsx";
import {useEffect, useState} from "react";
import createClient from "openapi-fetch";
import {paths} from "../../lib/api.ts";
import {FlightSchema} from "../../lib/types.ts";
import {API_HOST} from "../../utils/consts.ts";

const {POST} = createClient<paths>({baseUrl: API_HOST});

export default function DashboardPage() {
    const [flights, setFlights] = useState<FlightSchema[]>([]);
    const [actionId] = useState<number>(1);

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
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <FlightsTable flights={flights} />
            </Grid>
        </Grid>
    )
}
