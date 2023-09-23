import {FlightType, PayersType, PaymentMethod, TowType} from "../lib/types.ts";

export const API_HOST = 'http://localhost:9001';


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
    STATUS: "סטטוס",
    GLIDER: "דאון",
    PILOT_1: "טייס ראשון או חניך",
    PILOT_2: "טייס שני או מדריך",
    TOW_AIRPLANE: "מטוס גורר",
    TOW_PILOT: "טייס גורר",
    TOW_TYPE: "סוג גרירה",
    NEW_FLIGHT: "טיסה חדשה",
    CREATE_NEW_FLIGHT: "צור טיסה חדשה",
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
