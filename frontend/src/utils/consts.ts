import {FlightState, FlightType, PayersType, PaymentMethod, TowType} from "../lib/types.ts";

export const VITE_API_HOST = import.meta.env.VITE_API_HOST;


export const CACHE_KEY_ACTION = 'action';
export const CACHE_KEY_THEME = 'theme';


export const TEXTS_HEBREW = {
    APP_NAME: "ניהול פעולת הדאיה",
    DASHBOARD: "לוח הטיסות",
    TOGGLE_THEME: "שנה צבע",
    CURRENT_ACTION: "הפעולה הנוכחית",
    SELECT_ACTION: "בחר פעולה",
    SELECT: "בחר",
    CANCEL: "ביטול",
    ACTION: "פעולה",
    CLICK_TO_SELECT: "לחץ לבחירה",
    FIELD_RESPONSIBLE: "אחראי בשדה",
    RESPONSIBLE_CFI: "מדריך אחראי",
    STATE: "שלב",
    GLIDER: "דאון",
    PILOT_1: "טייס ראשון או חניך",
    PILOT_2: "טייס שני או מדריך",
    TOW_AIRPLANE: "מטוס גורר",
    TOW_PILOT: "טייס גורר",
    TOW_TYPE: "גובה גרירה",
    NEW_FLIGHT: "טיסה חדשה",
    CREATE_FLIGHT: "צור טיסה חדשה",
    FLIGHT_TYPE: "סוג טיסה",
    PAYERS_TYPE: "סוג משלם",
    PAYMENT_METHOD: "אמצעי תשלום",
    DUPLICATE_FLIGHT: "שכפל טיסה",
    DELETE_FLIGHT: "מחק טיסה",
    DELETE_FLIGHT_CONFIRMATION: "האם אתה בטוח שברצונך למחוק את הטיסה?",
    PAYING_MEMBER: "חבר משלם",
    PAYMENT_RECEIVER: "מקבל תשלום",
    CONFIRM: "אישור",
    EDIT_FLIGHT: "ערוך טיסה",
    CLEAR: "נקה",
    ADVANCED_EDIT: "עריכה מתקדמת",
    CLEAR_CONFIRMATION: "האם אתה בטוח שברצונך לנקות את הטופס?",
    TAKE_OFF_TIME: "שעת ההמראה",
    LANDING_TIME: "שעת הנחיתה",
    DRAFT: "בהכנה",
    TOW: "בגרירה",
    INFLIGHT: "בטיסה",
    LANDED: "נחתה",
    DURATION: "משך",
    FLIGHT_STATE: "שלב טיסה",
    FLIGHT_STATES: "שלבי טיסה",
    FLIGHT_HAS_BUSY_ENTITIES_ALERT: "לא ניתן לשגר את הטיסה עד שהבאים מתפנים",
    SOLO_FLIGHT: "טיסת סולו",
    TOW_RELEASE_TIME: "שעת סיום הגרירה",
    ACTION_NOT_SELECTED_MESSAGE: "יש לבחור פעולה על מנת להתחיל.",
    ACTION_NOT_SELECTED_TITLE: "לא נבחרה פעולה",
    QUIT_ACTION: "צא מהפעולה",
    ACTIVE_TOW_AIRPLANES: "מטוסים גוררים פעילים",
    SELECT_TOW_PILOT: "בחר טייס גורר",
    ACTION_NOT_FULLY_CONFIGURED_TITLE: "נא להגדיר את הפעולה",
    ACTION_NOT_FULLY_CONFIGURED_MESSAGE: "יש להשלים את הגדרת הפעולה על מנת להתחיל",
    MISSING_CONFIGURATIONS: "הגדרות חסרות",
    NO_TOW_AIRPLANES_AVAILABLE: "אין מטוסים גוררים זמינים",
    TOW_AIRPLANE_NOT_AVAILABLE: "המטוס הגורר לא זמין",
    DISPATCH_FLIGHT: "שגר טיסה",
    SELECT_TOW_TYPE: "בחר גובה גרירה",
    SELF_LAUNCH: "המראה עצמית",
    CREW: "צוות",
    TOW_PILOT_CANNOT_TOW_HIMSELF: "לא ניתן לשבץ טייס גורר כגורר של עצמו",
    FLIGHTS: "טיסות",
    CANNOT_DEACTIVATE_TOW_AIRPLANE_DURING_TOW: "לא ניתן לעדכן מטוס גורר במהלך גרירה",
    CONFIRM_FLIGHT_STATE_CHANGE_TO_PREVIOUS: "האם אתה בטוח שברצונך להחזיר את הטיסה לשלב הקודם?",
    DEACTIVATE_TOW_AIRPLANE_CONFIRMATION: "האם אתה בטוח שברצונך להפסיק את הפעלת את המטוס הגורר?",
    UPDATE_RESPONSIBLE_CFI_CONFIRMATION: "האם אתה בטוח שברצונך לשנות את המדריך האחראי?",
    UPDATE_FIELD_RESPONSIBLE_CONFIRMATION: "האם אתה בטוח שברצונך לשנות את האחראי בשדה?",
    CLOSE_ACTION: "סגירת הפעולה",
    ACTION_CLOSED_TITLE: "הינך צופה בפעולה שנסגרה!",
    ACTION_CLOSED_MESSAGE: "יש לשים לב שמתאפשרת עריכת נתונים חלקית בלבד.",
    CLOSE_ACTION_CONFIRMATION: "האם אתה בטוח שברצונך לסגור את הפעולה?",
    ID: "מספר זיהוי",
    DATE: "תאריך",
    WEEKDAY: "יום בשבוע",
    SUNDAY: "ראשון",
    MONDAY: "שני",
    TUESDAY: "שלישי",
    WEDNESDAY: "רביעי",
    THURSDAY: "חמישי",
    FRIDAY: "שישי",
    SATURDAY: "שבת",
    IS_CLOSED: "סגורה",
    YES: "כן",
    NO: "לא",
    CONFIRM_ACTION_CHANGE: "בבקשה אשר את שינוי הפעולה לפעולה הבאה",
    GO_TO_NEXT_PAGE: "עבור לעמוד הבא",
    GO_TO_PREVIOUS_PAGE: "חזור לעמוד הקודם",
    PAGE: "עמוד",
    FLIGHT_LANDED: "טיסה נחתה",
    FLIGHT_TOOK_OFF: "טיסה המריאה",
    FLIGHT_TOW_RELEASED: "סיום גרירה",
    ACTION_CLOSED: "הפעולה נסגרה",
    RESPONSIBLE_CFI_ASSIGNED: "מדריך אחראי הוקצה",
    RESPONSIBLE_CFI_UNASSIGNED: "מדריך אחראי הוסר",
    FIELD_RESPONSIBLE_ASSIGNED: "אחראי בשדה הוקצה",
    FIELD_RESPONSIBLE_UNASSIGNED: "אחראי בשדה הוסר",
    TOW_AIRPLANE_ACTIVATED: "מטוס גורר הופעל",
    TOW_AIRPLANE_DEACTIVATED: "מטוס גורר שוחרר",
    CREATED_AT: "זמן יצירה",
    TYPE: "סוג",
    AUTHOR: "יוצר",
    DATA: "נתונים",
    EVENTS: "אירועים",
    NOTIFICATIONS: "הודעות",
    RECIPIENT_NAME: "שם הנמען",
    RECIPIENT_EMAIL: "אימייל הנמען",
    SENT_AT: "זמן שליחה",
    STATUS: "סטטוס",
    FLIGHTSUMMARYFORPILOT: "סיכום הטיסה לטייס דאון",
    DAILYSUMMARYFOROBSERVER: "סיכום טיסות למפקח",
    SUMMARYFORTOWPILOT: "סיכום טיסות לטייס גורר",
    SUMMARYFORCFI: "סיכום טיסות למדריך",
    PENDING: "ממתין לשליחה",
    BEING_HANDLED: "בטיפול",
    SENT: "נשלח",
    FAILED: "נכשל",
    OPEN_SUMMARY_GENERATOR: 'הפקת דו״ח',
    GLIDER_PILOT: "טייס דאון",
    GENERATE_SUMMARY: 'הפקת דו״ח סיכום',
    REPORT_TYPE: 'סוג דו״ח',
    NUM_FLIGHTS: 'מספר טיסות',
    TOTAL_DURATION: 'זמן טיסה כולל',
    HOURS_MINUTES_SECONDS: 'שניות:דקות:שעות',
    CLOSE: 'סגור',
    SETTINGS: 'הגדרות',
    CONFIRM_ACTION_REOPEN: 'האם אתה בטוח שברצונך לפתוח מחדש את הפעולה?',
    REOPEN_ACTION: 'פתיחה מחדש של הפעולה',
    ACTION_REOPENED: 'הפעולה נפתחה מחדש',
    SETTLE_PAYMENT: 'הסדר תשלום',
    PAYMENT_BY_CLUB_MEMBER: 'חבר מועדון משלם על הטיסה',
    FLIGHTS_WITH_UNSETTLED_PAYMENTS_TITLE: 'קיימות טיסות עם תשלומים שלא הוסדרו',
    FLIGHTS_WITH_UNSETTLED_PAYMENTS_MESSAGE: 'יש להסדיר את התשלומים על מנת לאפשר את סגירת הפעולה.',
}


export const SUPPORTED_FLIGHT_TYPES : FlightType[] = [
    "Instruction",
    "ClubGuest",
    "MembersGuest",
    "Inspection",
    "Members",
    "InstructorsCourse",
    "Solo"
]

export const SUPPORTED_TOW_TYPES: TowType[] = [
    "AIRPLANE_1000",
    "AIRPLANE_1500",
    "AIRPLANE_2000",
    "AIRPLANE_2500",
    "AIRPLANE_3000",
    "AIRPLANE_3500",
]

export const SUPPORTED_PAYMENT_METHODS: PaymentMethod[] = [
    "Cash",
    "CreditCard",
    "Check",
    "Bit",
]

export const SUPPORTED_PAYERS_TYPES: PayersType[] = [
    "NoPayment",
    "FirstPilot",
    "Guest",
    "BothPilots",
    "SecondPilot",
    "ThirdMember"
]


export const ORDERED_FLIGHT_STATES: FlightState[] = [
    "Draft",
    "Tow",
    "Inflight",
    "Landed",
];
