from typing import List

from src import Flight, Member, Action, TowAirplane
from src.i18n.i18n_client import I18nClient
from src.utils.common import stringify_duration


class HebrewI18nClient(I18nClient):
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
            "NoPayment": "ללא תשלום",
            "FirstPilot": "טייס ראשון",
            "Guest": "אורח",
            "BothPilots": "שני הטייסים",
            "SecondPilot": "טייס שני",
            "ThirdMember": "חבר שלישי",
            "Instruction": "הדרכה",
            "ClubGuest": "אורח מועדון",
            "MembersGuest": "אורח חבר",
            "Inspection": "בדיקה",
            "Members": "חברים",
            "InstructorsCourse": "קורס מדריכים",
            "Solo": "סולו",
            "Cash": "מזומן",
            "Check": "צ׳ק",
            "CreditCard": "כרטיס אשראי",
            "Bit": "ביט",
            "AIRPLANE_1000": "1000 רגל",
            "AIRPLANE_1500": "1500 רגל",
            "AIRPLANE_2000": "2000 רגל",
            "AIRPLANE_2500": "2500 רגל",
            "AIRPLANE_3000": "3000 רגל",
            "AIRPLANE_3500": "3500 רגל",
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

    def format_summary_for_tow_pilot_email_message_template(
        self,
        tow_pilot: Member,
        tow_airplane: TowAirplane,
        action: Action,
        flights: List[Flight],
        flights_table_html: str,
    ) -> str:
        return f"""
        <table dir="rtl">
                        <tr>שלום,</tr>
                        <tr></tr>
                        <tr>בתאריך {action.date.strftime('%Y-%m-%d')} ביצעת {len(flights)} טיסות במטוס {tow_airplane.call_sign}.</tr>
                        <tr></tr>
                        {flights_table_html}
                        <tr></tr>
                        <tr>תודה,</tr>
                        <tr>מרכז הדאיה מגידו</tr>
                    </table>
        """

    def get_flight_summary_for_pilot_email_message_subject(self, flight: Flight) -> str:
        duration_str = stringify_duration(
            start_time=flight.take_off_at, end_time=flight.landing_at
        )

        return f"טיסתך בדאון {flight.glider.call_sign} נמשכה {duration_str} שעות"

    def get_summary_for_tow_pilot_email_message_subject(
        self,
        tow_pilot: Member,
        tow_airplane: TowAirplane,
        action: Action,
        flights: List[Flight],
    ) -> str:
        date_str = action.date.strftime("%Y-%m-%d")

        return f"ביצעת {len(flights)} גרירות במטוס {tow_airplane.call_sign} בתאריך {date_str}"
