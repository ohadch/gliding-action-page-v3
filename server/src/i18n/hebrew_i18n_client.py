from src import Flight
from src.i18n.i18n_client import I18nClient
from src.utils.common import stringify_duration


class HebrewI18nClient(I18nClient):
    def get_flight_summary_for_pilot_email_subject(self) -> str:
        pass

    def translate(self, key: str) -> str:
        return {
            "GLIDER": "דאון",
            "TAKE_OFF_TIME": "שעת ההמראה",
            "LANDING_TIME": "שעת הנחיתה",
            "FLIGHT_DURATION": "משך הטיסה",
            "PILOT_1": "טייס 1 או חניך",
            "PILOT_2": "טייס 2 או מדריך",
            "FLIGHT_TYPE": "סוג הטיסה",
            "TOW_TYPE": "גובה הגרירה",
            "TOW_AIRPLANE": "המטוס הגורר",
            "TOW_PILOT": "הטייס הגורר",
            "PAYERS_TYPE": "זהות המשלם",
            "PAYMENT_METHOD": "אופן התשלום",
            "PAYMENT_RECEIVER": "מקבל התשלום",
        }.get(key, key)

    def format_flight_summary_for_pilot_email_message_template(
        self, flight: Flight, values_str: str
    ) -> str:
        return f"""
        <table dir="rtl">
                        <tr>שלום,</tr>
                        <tr></tr>
                        <tr>מצורף סיכום לטיסתך מתאריך {flight.take_off_at.strftime('%Y-%m-%d')}.</tr>
                        <tr></tr>
                        {values_str}
                        <tr></tr>
                        <tr>מקווים שנהנית,</tr>
                        <tr>מרכז הדאיה מגידו</tr>
                    </table>
        """

    def get_flight_summary_for_pilot_email_message_subject(self, flight: Flight) -> str:
        duration_str = stringify_duration(
            start_time=flight.take_off_at, end_time=flight.landing_at
        )

        return f"טיסתך בדאון {flight.glider.call_sign} נמשכה {duration_str} שעות"
