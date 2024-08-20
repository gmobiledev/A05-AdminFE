export enum ObjectLocalStorage {
    CURRENT_USER = 'currentUser'
}

export enum TaskTelecomStatus {
    STATUS_CANCEL = -1,
    STATUS_INIT = 0,
    STATUS_PROCESSING = 2, //giao dịch viên đã bấm tiếp nhận yêu cầu
    STATUS_PROCESS_TO_MNO = 3, //Đã đẩy sang đối tác nhà mạng
    STATUS_REJECT = 4, //Đấu nối sang nhà mạng thất bại
    STATUS_SUCCESS = 1, //Thành công
    STATUS_NEW_ORDER = 5,
    STATUS_SUCCESS_PART = 11,  // THành công 1 phần
    STATUS_INIT_2G_GSIM = 20,
    STATUS_PAID_WAITING_EKYC = 25, //Đã thanh toán Chờ ekyc
    STATUS_PAID_SUSPENDING = 26, // Chuẩn bị thu hồi
    STATUS_PAID_TERMINATED = 27, //Đã thu thồi
    STATUS_APPROVED = 30, //chấp nhận từ 30-39, duyệt từ lớn đến bé
    STATUS_APPROVED_1 = 31,
    STATUS_APPROVED_2 = 32,
    STATUS_APPROVED_3 = 33,
    STATUS_DVKHKD_REJECT = 40,
    STATUS_WAITING_SIM = 60,
    STATUS_WAITING_CONTRACT = 61,
    STATUS_NEW_ORDER_ORGANIZATION = 50
}

export enum MsisdnStatus {
    STATUS_PROCESSED_MNO_SUCCESS = 1, //đã đấu nối
    STATUS_2G_VALID = 30, //2g được chuyển đổi
    STATUS_2G_WAITING = 31, //2g chờ đợt tiếp
    STATUS_2G_PAID = 34,//2g trả sau đã thanh toán
    STATUS_UNKNOWN = -1, // Trạng thái ko rõ của IT
    // STATUS_PREACTIVE = 91, // Trạng thái Trước kích hoạt của IT
    STATUS_SUCCESS = 1, //thành công
    STATUS_NOT_PROCESS_MNO = 2, //TTTB G99 thành công, Mạng hợp tác chưa được xử lý
    STATUS_PROCESSED_MNO_FAIL = 3, //TTTB G99 thành công, Mạng hợp tác thất bại
    STATUS_PRE_REGISTER = 4, //Hợp lệ chờ đấu nối        
    STATUS_2G_CASE_BY_CASE = 32, //2G phải được duyệt
    STATUS_2G_TS = 33,   //2G trả sau
    STATUS_4G = 40,    //Đã chuyển đổi sang sim 4G
    // STATUS_LOCK_INACTIVE = 51, //Chưa rõ
    // STATUS_GSIM = 60, //GSIM
    STATUS_S1 = 90, //Chặn 1 chiều
    STATUS_S2 = 93, //Chặn 2 chiều
    STATUS_ACTIVE_LOCKED = 94, // Trạng thái khóa từ bên IT (~số bị khóa 2 chiều)
    STATUS_S3 = 95, //Chuẩn bị thu hồi
    STATUS_TERMINATE = 99 //Chấm dứt, thu hồi
}


export enum ProductStatus {
    STATUS_ACTIVE = 1,
    STATUS_AVAILABLE = 2,
    STATUS_LOCKED = 3,
    LOCKED_BY_ADMIN = 4,
    STATUS_INIT = 0,
}

export enum ProductStoreStatus {
    STATUS_SOLD = 1,
    STATUS_AVAILABLE = 0,
    STATUS_INIT = 21,
    STATUS_EXPORTED = 5
}

export enum BatchType {
    INPUT = 1,
    OUTPUT = -1,
    RETRIEVE = 3    
}

export enum BatchStatus {
    INIT = 0, // lô mới khởi tạo
    APPROVED = 2, // lô đã duyệt
    COMPLETED = 1, // số đã được duyệt
    CANCEL = -1, //lô không được duyệt

    //duyệt giảm dần xuống 11, từ 11 duyệt thành 2 (APPROVED)
    // APPROVED_19 = 19,
    // APPROVED_18 = 18,
    // APPROVED_17 = 17,
    APPROVED_BY_ACCOUNTANT = 11,
    CANCEL_BY_OFFICE = -2,
    CANCEL_BY_ACCOUNTANT = -11,
    CANCEL_BY_USER = -12

}

export enum TelecomAction {
    TOPUP = "TOPUP",
    ORDER_NUMBER = "ORDER_NUMBER",
    GENERATE_CONTRACT = "GENERATE_CONTRACT",
    REQUIRE_TO_PREPAID = "REQUIRE_TO_PREPAID"
}


export class TaskTelecom {
    static ACTION = {
        new_sim: {
            value: 'new_sim',
            label: 'Đăng ký mới'
        },
        PAY_COMMITMENT: {
            value: 'PAY_COMMITMENT',
            label: 'Gia hạn'
        },
        change_info: {
            value: 'change_info',
            label: 'Cập nhật TTTB'
        },
        change_sim: {
            value: 'change_sim',
            label: 'Đổi sim'
        },
        change_user_info: {
            value: 'change_user_info',
            label: 'Đổi thông tin'
        },
        CHECK_CONVERSION_2G: {
            value: 'CHECK_CONVERSION_2G',
            label: '2G sang 4G'
        },
        TYPE_2G_CONVERSION: {
            value: '2G_CONVERSION',
            label: 'Đổi 2G'
        },
        GSIM_TO_SIM: {
            value: 'GSIM_TO_SIM',
            label: 'GSIM sang SIM'
        },
        CANCEL_SUBCRIBER: {
            value: 'cancel_subcriber',
            label: 'Hủy sim'
        },
        _4G_VNM_TO_VMS: {
            value: '4G_VNM_TO_VMS',
            label: 'Chuyển VNM sang Mobifone'
        }
    };
}

export class TelecomConst {
    public static TELCO = [
        {
            code: 'VTT',
            desc: 'Viettel'
        },
        {
            code: 'VMS',
            desc: 'Mobifone'
        },
        {
            code: 'VNM',
            desc: 'Vietnammobile'
        },
        {
            code: 'VNP',
            desc: 'Vinaphone'
        }
    ]
}



export enum STORAGE_KEY {
    FCM_SUBSCRIBE = 'fcm_subscribe'
}


export enum TaskAction {
    ORDER_NUMBER = "ORDER_NUMBER",
    TOPUP = "TOPUP",
    TOPUP_2G = "TOPUP_2G",
    REQUIRE_TO_PREPAID = "REQUIRE_TO_PREPAID",
    GENERATE_CONTRACT = 'GENERATE_CONTRACT',
    CONVERT_TO_PREPAID = "CONVERT_TO_PREPAID",
    EVICTION = "EVICTION"
}

export enum TASK_DETAIL {
    GConversion = '2G_Conversion'
}

export enum SUB_ACTION {
    TRA_SAU_SANG_TRA_TRUOC = 'tra_sau_sang_tra_truoc',
    TRA_TRUOC = 'tra_truoc'
}

export enum HANG_SO_THUE_BAO {
    NORMAL = 'NORMAL',
    SILVER = 'SILVER',
    GOLD = 'GOLD',
    PLATIUM = 'PLATIUM',
    BRONZE = 'BRONZE',
    QUASI ='QUASI'
//     + Hạng số Bạch Kim/Platinum (P)
// + Hạng số Vàng/Gold (G)
// + Hạng số Bạc/Silver (S)
// + Hạng số Đồng/Bronze (B)
// + Hạng số Chọn/Quasi (Q)
// + Hạng số Thường/Normal (N)

}

export class ProductConstant {
    public static HANG_SO_THUE_BAO  = [
        { id: 'NORMAL', name: 'NORMAL' },
        { id: 'QUASI', name: 'QUASI' },
        { id: 'BRONE', name: 'BRONE' },
        { id: 'SILVER', name: 'SILVER' },
        { id: 'GOLD', name: 'GOLD' },
        { id: 'PLATINUM', name: 'PLATINUM' },
      ]
}

export enum PriceAction {
    ADD = "ADD", //Công thêm 1 số tiền    
    PERCENT = "PERCENT", // Tăng hoặc giảm % tiền
    FIX = "FIX" //set giá
  }

  export enum MAXIMUM_VALUE {
    ROW_QUERY_PRODUCT_BATCH = 100000
  }

export enum AdminChannelAction {    
    CREATE_EXPORT = 'CREATE_EXPORT',
    CREATE_RETRIEVE = 'CREATE_RETRIEVE',
    APPROVE_EXPORT_LEVEL11 = 'APPROVE_EXPORT_LEVEL11',
    APPROVE_EXPORT_LAST = 'APPROVE_EXPORT_LAST',    
    APPROVE_IMPORT_LEVEL11 = 'APPROVE_IMPORT_LEVEL11',
    APPROVE_IMPORT_LAST = 'APPROVE_IMPORT_LAST',    
    APPROVE_RETRIEVE_LEVEL11 = 'APPROVE_RETRIEVE_LEVEL11',
    APPROVE_RETRIEVE_LAST = 'APPROVE_RETRIEVE_LAST',
    CONFIRM_RETRIEVE = 'CONFIRM_RETRIEVE'
}

export enum ExportType {
    P2C = 'P2C', //
    P2P = 'P2P',
    H2L = 'H2L',
    A2A = 'A2A'
}

export enum FIX_ROLE {
    DUYET_XUAT_KHO = 'DUYET_XUAT_KHO',
    QLY_KHO = 'QLY_KHO',
    DUYET_THU_HOI_KHO = 'DUYET_THU_HOI_KHO',
    TAO_XUAT_KHO = 'TAO_XUAT_KHO',
    TAO_THU_HOI_KHO = 'TAO_THU_HOI_KHO'
}

export enum ServiceCode {
    AIRTIME_TOPUP = 'AIRTIME_TOPUP',
    SIM_PROFILE = 'SIM_PROFILE',
    BUY_DATA = 'BUY_DATA',
    ĐKTTTB = 'ĐKTTTB',
    SIM_KITTING = "SIM_KITTING",
    SIM_REGISTER = "SIM_REGISTER" ,
    ADD_MONEY_BALANCE = "ADD_MONEY_BALANCE",
    ADD_DATA_BALANCE = "ADD_DATA_BALANCE",
    TELECOM_TOPUP = "TELECOM_TOPUP"
}

export enum TaskStatus {
    STATUS_INIT = 0,
    STATUS_REJECT = 99,
    STATUS_SUCCESS = 1,
    STATUS_CANCEL = -1,
    STATUS_WAITING = 2,
    STATUS_APPROVED = 3,
    STATUS_DISBURSING = 4, //chờ giải ngân
    STATUS_DISBURSED = 5, //Đã giải ngân
    STATUS_WAITING_BUSINESS_DEPARTMENT = 10,
    STATUS_WAITING_PAYMENT=20,
    STATUS_WAITING_ACCOUNTING = 30,
    STATUS_WATING_ITADMIN = 60,
    STATUS_IN_PROGRESS = 8,
    STATUS_SUCCESS_PART = 100,
    STATUS_FAIL = -100
}