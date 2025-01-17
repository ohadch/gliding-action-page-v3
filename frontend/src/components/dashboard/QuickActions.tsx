import { Grid, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Summarize } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { DISABLE_CLOSING_ACTION } from "../../utils/consts";
import { FlightSchema } from "../../lib/types";

interface QuickActionsProps {
    onGenerateSummary: () => void;
    onCloseAction: () => void;
}

export function QuickActions({ onGenerateSummary, onCloseAction }: QuickActionsProps) {
    const { t } = useTranslation();
    const { flights } = useSelector((state: RootState) => state.actions);
    const action = useSelector((state: RootState) => 
        state.actions.actions?.find((action) => action.id === state.actions.actionId)
    );

    const activeFlightsExist = flights?.some(
        (flight) => (flight.state === "Tow") || (flight.state === "Inflight")
    );
    const nonFlightsExist = flights?.some((flight) => flight.state !== "Draft");

    const isCloseActionDisabled = () => {
        if (DISABLE_CLOSING_ACTION) {
            return true;
        }

        const clubGuestFlights = flights?.filter((flight) => flight.flight_type === "ClubGuest") || [];

        const isFlightPaymentSettled = (flight: FlightSchema) => {
            if (flight.flight_type !== "ClubGuest") {
                return true;
            }

            return Boolean(
                (flight.paying_member_id) || 
                (flight.payment_method && flight.payment_receiver_id)
            );
        };

        const clubGuestFlightsWithUnsettledPaymentsExist = clubGuestFlights
            .some((flight) => !isFlightPaymentSettled(flight));

        return activeFlightsExist || 
               Boolean(action?.closed_at) || 
               clubGuestFlightsWithUnsettledPaymentsExist;
    };

    return (
        <Grid
            pt={2}
            sx={{
                textAlign: "center",
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                gap: 3
            }}
        >
            <Button
                variant="contained"
                color="success"
                onClick={onGenerateSummary}
                disabled={!nonFlightsExist}
                size="large"
                sx={{
                    fontSize: "1.5rem",
                }}
            >
                <Summarize sx={{ mr: 1 }} />
                {t("OPEN_SUMMARY_GENERATOR")}
            </Button>

            <Button
                variant="contained"
                color="error"
                disabled={isCloseActionDisabled()}
                onClick={onCloseAction}
                size="large"
                sx={{
                    fontSize: "1.5rem",
                }}
            >
                {t("CLOSE_ACTION")}
            </Button>
        </Grid>
    );
} 