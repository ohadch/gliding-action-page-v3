from typing import List, Tuple

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
            "AIRPLANE_1500": "1500 רגל",
            "AIRPLANE_2000": "2000 רגל",
            "AIRPLANE_2500": "2500 רגל",
            "AIRPLANE_3000": "3000 רגל",
            "AIRPLANE_3500": "3500 רגל",
            "AIRPLANE_4000": "4000 רגל",
            "NUMBER_OF_FLIGHTS": "מספר טיסות",
            "TOTAL_FLIGHTS_DURATION": "זמן טיסה כולל",
        }.get(key, key)

    def format_flight_summary_for_pilot_email_message_template(
        self,
        member: Member,
        flight: Flight,
        flight_details_html: str,
        flights_by_glider: List[Tuple[str, int, str, str]],
    ) -> str:
        flights_by_gliders_html = "".join(
            [
                f"""
            <ul style="list-style-type:none;">
                <li>
                    <strong>דאון:</strong>
                    {glider_call_sign}
                </li>
                <li>
                    <strong>מספר טיסות:</strong>
                    {num_flights_in_glider}
                </li>
                <li>
                    <strong>זמן טיסה כולל:</strong>
                    {glider_flights_duration} (שעות:דקות:שניות)
                </li>
            </ul>
            <tr>
                <td colspan="2">{glider_flights_html}</td>
            </tr>
            """
                for glider_call_sign, num_flights_in_glider, glider_flights_duration, glider_flights_html in flights_by_glider
            ]
        )

        daily_summary_html = (
            f"""
            <tr>סיכום טיסות יומי לפי דאונים:</tr>
            <tr></tr>
            {flights_by_gliders_html}
            """
            if len(flights_by_glider) > 1
            else ""
        )
        return f"""
        <table dir="rtl">
                        <tr>שלום {member.full_name},</tr>
                        <tr></tr>
                        <tr>מצורף סיכום לטיסתך מתאריך {flight.take_off_at.strftime('%Y-%m-%d')}.</tr>
                        <tr></tr>
                        {flight_details_html}
                        <tr></tr>
                        {daily_summary_html}
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
        html: str,
    ) -> str:
        return f"""
        <table dir="rtl">
                        <tr>שלום {tow_pilot.full_name},</tr>
                        <tr></tr>
                        <tr>בתאריך {action.date.strftime('%Y-%m-%d')} ביצעת {len(flights)} גרירות במטוס הגורר {tow_airplane.call_sign}.</tr>
                        <tr></tr>
                        {html}
                        <tr></tr>
                        <tr>תודה,</tr>
                        <tr>מרכז הדאיה מגידו</tr>
                    </table>
        """

    def get_flight_summary_for_pilot_email_message_subject(self, flight: Flight) -> str:
        duration_str = stringify_duration(
            total_duration=flight.landing_at - flight.take_off_at
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

    def get_daily_summary_for_observer_email_message_subject(
        self,
        action: Action,
    ) -> str:
        date_str = action.date.strftime("%Y-%m-%d")

        return f"סיכום פעולת הדאיה מתאריך {date_str}"

    def format_daily_summary_for_observer_email_message_template(
        self,
        observer: Member,
        action: Action,
        flights: List[Flight],
        flights_html: str,
    ) -> str:
        date_str = action.date.strftime("%Y-%m-%d")

        return f"""
        <table dir="rtl">
            <tr>שלום {observer.full_name},</tr>
            <tr></tr>
            <tr>מצורף סיכום לפעולת הדאיה מתאריך {date_str}.</tr>
            <tr></tr>
            {flights_html}
            <tr></tr>
            <tr>הודעה זאת נשלחת אלייך מכיוון שאתה מסומן ברשימת מדווחי הפעולה של המועדון.</tr>
            <tr></tr>
            <tr>תודה,</tr>
            <tr>מרכז הדאיה מגידו</tr>
        </table>
        """

    def get_daily_summary_for_observer_email_message(
        self, observer: Member, action: Action, flights: List[Flight]
    ) -> str:
        flights_html = self._create_flights_table_html(
            flights=flights,
        )

        return self.format_daily_summary_for_observer_email_message_template(
            observer=observer,
            action=action,
            flights=flights,
            flights_html=flights_html,
        )

    def get_flights_email_report_email_message_subject(
        self, flights: List[Flight]
    ) -> str:
        return f"פרטי {len(flights)} טיסות שנשלחו מהמגדל"

    def format_flights_email_report_email_message_template(
        self,
        member: Member,
        action: Action,
        flights: List[Flight],
        flights_metadata_html: str,
        flights_table_html: str,
    ) -> str:
        date_str = action.date.strftime("%Y-%m-%d")

        return f"""
        <table dir="rtl">
            <tr>שלום {member.full_name},</tr>
            <tr></tr>
            <tr>מצורפים פרטי {len(flights)} טיסות שנשלחו מהמגדל בתאריך {date_str}.</tr>
            <tr></tr>
            {flights_metadata_html}
            <tr></tr>
            {flights_table_html}
            <tr></tr>
            <tr>תודה,</tr>
            <tr>מרכז הדאיה מגידו</tr>
        </table>
        """
