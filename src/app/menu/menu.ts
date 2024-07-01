import { CoreMenu } from '@core/types';

//? DOC: http://localhost:7777/demo/vuexy-angular-admin-dashboard-template/documentation/guide/development/navigation-menus.html#interface

export const menu: CoreMenu[] = [

  {
    id: 'dashboard',
    title: 'Console',
    translate: '',
    type: 'collapsible',
    icon: 'home',
    badge: {
      title: '2',
      translate: 'MENU.DASHBOARD.BADGE',
      classes: 'badge-light-warning badge-pill'
    },
    children: [
      {
        id: 'ecommerce',
        title: 'Báo cáo',
        translate: '',
        type: 'item',
        icon: 'circle',
        url: 'dashboard/reports'
      }
    ]
  },

  // Apps & Pages
  {
    id: 'users',
    title: 'Merchant',
    translate: '',
    type: 'collapsible',
    icon: 'package',
    badge: {
      title: '4',
      translate: '',
      classes: 'badge-light-warning badge-pill'
    },
    children: [

      {
        id: 'users',
        title: 'Danh sách merchant',
        translate: '',
        type: 'item',
        icon: 'user',
        url: 'merchant/list'
      },
      {
        id: 'transaction',
        title: 'Duyệt Airtime',
        translate: '',
        type: 'item',
        icon: 'check-circle',
        url: 'user/airtime'
      },
      {
        id: 'users',
        title: 'Duyệt tài khoản tổng',
        translate: '',
        type: 'item',
        icon: 'dollar-sign',
        url: 'merchant/root-payment'
      },
      {
        id: 'users',
        title: 'Chiết khấu',
        translate: '',
        type: 'item',
        icon: 'trending-down',
        url: 'services/discount'
      },
      {
        id: 'users',
        title: 'Báo cáo',
        translate: '',
        type: 'item',
        icon: 'circle',
        url: 'merchant/root'
      }
    ]
  },
  {
    id: 'users',
    type: 'section',
    title: 'Khách hàng',
    translate: 'MENU.APPS.CUSTOMER.SECTION',
    icon: 'package',
    children: [
      {
        id: 'users',
        title: 'Danh sách',
        translate: 'MENU.LIST',
        type: 'item',
        icon: 'user',
        url: 'customer/list'
      }
    ]
  },
  {
    id: 'users',
    title: 'Mua sim số',
    translate: '',
    type: 'collapsible',
    icon: 'package',
    badge: {
      title: '4',
      translate: '',
      classes: 'badge-light-warning badge-pill'
    },
    children: [
      {
        id: 'users',
        title: 'Yêu cầu của đại lý',
        translate: '',
        type: 'item',
        icon: 'user',
        url: 'sim-so/task'
      },

      {
        id: 'agents',
        title: 'Danh sách đại lý',
        translate: '',
        type: 'item',
        icon: 'user',
        url: 'agent'
      },

      {
        id: 'agents',
        title: 'Lịch sử tác động',
        translate: '',
        type: 'item',
        icon: 'user',
        url: 'sim-so/action-logs'
      },
      {
        id: 'agents',
        title: 'Msisdn',
        translate: '',
        type: 'item',
        icon: 'user',
        url: 'sim-so/msisdn'
      },
    ]
  },
  {
    id: 'users',
    title: 'Sim cam kết',
    translate: '',
    type: 'collapsible',
    icon: 'package',
    badge: {
      title: '3',
      translate: '',
      classes: 'badge-light-warning badge-pill'
    },
    children: [
      {
        id: 'users',
        title: 'Đơn hàng',
        translate: '',
        type: 'item',
        icon: 'user',
        url: 'sim-so/commitment'
      },

      {
        id: 'agents',
        title: 'Thiết lập thuê bao',
        translate: '',
        type: 'item',
        icon: 'user',
        url: 'sim-so/warning'
      },

      {
        id: 'agents',
        title: 'Báo cáo thống kê',
        translate: '',
        type: 'item',
        icon: 'user',
        url: ''
      },
      
    ]
  },
  {
    id: 'users',
    title: 'SIM Du lịch',
    translate: '',
    type: 'collapsible',
    icon: 'package',
    badge: {
      title: '4',
      translate: '',
      classes: 'badge-light-warning badge-pill'
    },
    children: [
      {
        id: 'users',
        title: 'Đơn SIM Profile',
        translate: '',
        type: 'item',
        icon: 'circle',
        url: 'task/sim-profile'
      },

      {
        id: 'agents',
        title: 'Đơn Kitting',
        translate: '',
        type: 'item',
        icon: 'circle',
        url: 'task/sim-kitting'
      },

      {
        id: 'agents',
        title: 'Đăng ký TTTB',
        translate: '',
        type: 'item',
        icon: 'circle',
        url: 'task/sim-register'
      },
      {
        id: 'agents',
        title: 'Nạp tiền',
        translate: '',
        type: 'item',
        icon: 'circle',
        url: 'task/balance'
      },
      {
        id: 'agents',
        title: 'Nạp Data',
        translate: '',
        type: 'item',
        icon: 'circle',
        url: 'task/data'
      },
    ]
  },


  {
    id: 'users',
    title: 'Kho số',
    translate: '',
    type: 'collapsible',
    icon: 'package',
    badge: {
      title: '5',
      translate: '',
      classes: 'badge-light-warning badge-pill'
    },
    children: [
      {
        id: 'dashboard',
        title: 'Thống kê',
        translate: '',
        type: 'item',
        icon: 'database',
        url: 'inventory/dashboard'
      },

      {
        id: 'batch-sim',
        title: 'Xuất/nhập kho',
        translate: '',
        type: 'item',
        icon: 'database',
        url: 'inventory/batch-sim'
      },
      {
        id: 'channel',
        title: 'DS kênh bán hàng',
        translate: '',
        type: 'item',
        icon: 'database',
        url: 'inventory/channel'
      },
      {
        id: 'sell-chanel',
        title: 'Danh sách kho',
        translate: '',
        type: 'item',
        icon: 'database',
        url: 'inventory/sell-chanel'
      },

      // {
      //   id: 'sell-chanel',
      //   title: 'Chi tiết kho tổng',
      //   translate: '',
      //   type: 'item',
      //   icon: 'database',
      //   url: 'inventory/view-detail-totalSell'
      // },

      {
        id: 'report-business',
        title: 'Báo cáo tổng hợp',
        translate: '',
        type: 'item',
        icon: 'circle',
        url: 'inventory/report/kinh-doanh'
      },
      {
        id: 'report-doanh-thu',
        title: 'Báo cáo doanh thu',
        translate: '',
        type: 'item',
        icon: 'circle',
        url: 'inventory/report/doanh-thu'
      },
      {
        id: 'report-ton-kho-sim',
        title: 'Báo cáo tồn SIM',
        translate: '',
        type: 'item',
        icon: 'circle',
        url: 'inventory/report/ton-kho-sim'
      }  ,
      {
        id: 'i-action-logs',
        title: 'Nhật ký hoạt động',
        translate: '',
        type: 'item',
        icon: 'circle',
        url: 'inventory/action-logs'
      },
      {
        id: 'i-search-product-transfer',
        title: 'Số xuất/nhập kho',
        translate: '',
        type: 'item',
        icon: 'circle',
        url: 'inventory/search-product-transfer'
      }   
    ]
  },

  {
    id: 'users',
    title: 'Báo cáo S99',
    translate: '',
    type: 'collapsible',
    icon: 'package',
    badge: {
      title: '5',
      translate: '',
      classes: 'badge-light-warning badge-pill'
    },
    children: [

      {
        id: 'report-business',
        title: 'Tình trạng TB',
        translate: '',
        type: 'item',
        icon: 'circle',
        url: 'inventory/report/tong-hop'
      },
      {
        id: 'report-business',
        title: 'Chi tiết TB',
        translate: '',
        type: 'item',
        icon: 'circle',
        url: 'inventory/report/chi-tiet'
      },
      {
        id: 'report-business',
        title: 'Tổng hợp kết quả',
        translate: '',
        type: 'item',
        icon: 'circle',
        url: 'inventory/report/ket-qua'
      }
    ]
  },


  {
    id: 'users',
    title: 'GSIM',
    translate: '',
    type: 'collapsible',
    icon: 'phone-call',
    badge: {
      title: '4',
      translate: '',
      classes: 'badge-light-warning badge-pill'
    },
    children: [
      {
        id: 'g-task',
        title: 'Task',
        translate: '',
        type: 'item',
        icon: 'phone-call',
        url: 'gtalk/task'
      },
      {
        id: 'g-msisdn',
        title: 'Msisdn',
        translate: '',
        type: 'item',
        icon: 'database',
        url: 'gtalk/msisdn'
      },
      {
        id: 'g-customer',
        title: 'Khách hàng',
        translate: '',
        type: 'item',
        icon: 'database',
        url: 'gtalk/customer'
      },
      {
        id: 'g-report',
        title: 'Báo cáo',
        translate: '',
        type: 'item',
        icon: 'database',
        url: 'gtalk/report'
      },
    ]
  },

  {
    id: 'users',
    title: 'GIP',
    translate: '',
    type: 'collapsible',
    icon: 'phone-outgoing',
    badge: {
      title: '4',
      translate: '',
      classes: 'badge-light-warning badge-pill'
    },
    children: [
      {
        id: 'g-merchant',
        title: 'Merchant GIP',
        translate: '',
        type: 'item',
        icon: 'phone-outgoing',
        url: 'gip/merchant'
      },
      {
        id: 'list',
        title: 'Thuê bao GIP',
        translate: '',
        type: 'item',
        icon: 'database',
        url: 'gip/list'
      },
      {
        id: 'g-call',
        title: 'Lịch sử cuộc gọi',
        translate: '',
        type: 'item',
        icon: 'database',
        url: 'gip/call-history'
      },

      {
        id: 'g-task',
        title: 'Task',
        translate: '',
        type: 'item',
        icon: 'database',
        url: 'gip/task'
      },
      {
        id: 'g-task',
        title: 'Gói cước GIP',
        translate: '',
        type: 'item',
        icon: 'database',
        url: 'gip/package'
      },
    ]
  },

  {
    id: 'users',
    title: 'Khác',
    translate: '',
    type: 'collapsible',
    icon: 'package',
    badge: {
      title: '6',
      translate: '',
      classes: 'badge-light-warning badge-pill'
    },
    children: [

      {
        id: 'users',
        title: 'Sms log',
        translate: 'MENU.SMSLOG',
        type: 'item',
        icon: 'database',
        url: 'sms-log'
      },
      // {
      //   id: 'users',
      //   title: 'Đơn giao vật tư LTG',
      //   translate: 'MENU.ORDERLTG',
      //   type: 'item',
      //   icon: 'database',
      //   url: 'order-ltg'
      // },
      {
        id: 'report-revenue',
        title: 'Báo cáo',
        translate: 'MENU.REPORT',
        type: 'item',
        icon: 'database',
        url: 'task/report'
      },
      {
        id: 'task',
        title: 'Task',
        translate: 'MENU.TASK',
        type: 'item',
        icon: 'database',
        url: 'task/list'
      },
      {
        id: 'transaction',
        title: 'Giao dịch',
        translate: 'MENU.TRANSACTION',
        type: 'item',
        icon: 'list',
        url: 'transaction'
      },
      {
        id: 'transaction',
        title: 'Tài khoản',
        translate: '',
        type: 'item',
        icon: 'list',
        url: 'user/list'
      },
      {
        id: 'ekyc',
        title: 'Lô EKYC',
        translate: 'MENU.EKYCBATCH',
        type: 'item',
        icon: 'database',
        url: 'people/list-ekyc-batch'
      },
    ]
  },
  {
    id: 'users',
    title: 'Cộng tác viên',
    translate: '',
    type: 'collapsible',
    icon: 'users',
    badge: {
      title: '1',
      translate: '',
      classes: 'badge-light-warning badge-pill'
    },
    children: [
      {
        id: 'users',
        title: 'Cộng tác viên',
        translate: '',
        type: 'item',
        icon: 'users',
        url: 'collaborator'
      }
    ]
  },


  {
    id: 'users',
    type: 'section',
    title: 'CSKH',
    translate: '',
    icon: 'package',
    children: [
      {
        id: 'search-subscription',
        title: 'Tra cứu TTTB',
        translate: '',
        type: 'item',
        icon: 'search',
        url: 'sim-so/search-subscription'
      },
      // {
      //   id: 'search-topup',
      //   title: 'Lịch sử TOPUP',
      //   translate: '',
      //   type: 'item',
      //   icon: 'search',
      //   url: 'sim-so/msisdn/topup'
      // },
      // {
      //   id: 'search-balance-changes',
      //   title: 'Tra cứu cước',
      //   translate: '',
      //   type: 'item',
      //   icon: 'search',
      //   url: 'sim-so/msisdn/balance-changes'
      // },
      {
        id: 'search',
        title: 'Tìm Sim Số',
        translate: '',
        type: 'item',
        icon: 'search',
        url: 'sim-so/search'
      },
      {
        id: 'client2g',
        title: 'Tra cứu TTTB 2G',
        translate: '',
        type: 'item',
        icon: 'database',
        url: 'sim-so/client2g'
      }
    ]
  },


  {
    id: 'users',
    type: 'section',
    title: 'Users & Phân quyền',
    translate: 'MENU.APPS.USER.USERPERMISSION',
    icon: 'package',
    children: [
      {
        id: 'role',
        title: 'Vai trò',
        translate: 'MENU.APPS.USER.ROLE',
        type: 'item',
        icon: 'circle',
        url: 'role/list'
      },
      {
        id: 'users',
        title: 'Admin',
        translate: 'MENU.APPS.USER.ADMIN',
        type: 'item',
        icon: 'user',
        url: 'admin/list'
      }
    ]
  },
  // User Interface

  /*
  {
    id: 'user-interface',
    type: 'section',
    title: 'User Interface',
    translate: 'MENU.UI.SECTION',
    icon: 'layers',
    children: [
      {
        id: 'typography',
        title: 'Typography',
        translate: 'MENU.UI.TYPOGRAPHY',
        type: 'item',
        icon: 'type',
        url: 'ui/content/typography'
      },
      {
        id: 'colors',
        title: 'Colors',
        translate: 'MENU.UI.COLORS',
        type: 'item',
        icon: 'droplet',
        url: 'ui/colors'
      },
      {
        id: 'feather',
        title: 'Feather',
        translate: 'MENU.UI.FEATHER',
        type: 'item',
        icon: 'eye',
        url: 'ui/icons/feather'
      },
      {
        id: 'cards',
        title: 'Cards',
        translate: 'MENU.UI.CARDS.COLLAPSIBLE',
        type: 'collapsible',
        icon: 'credit-card',
        badge: {
          title: 'New',
          translate: 'MENU.UI.CARDS.BADGE',
          classes: 'badge-light-success badge-pill'
        },
        children: [
          {
            id: 'card-basic',
            title: 'Basic',
            translate: 'MENU.UI.CARDS.BASIC',
            type: 'item',
            icon: 'circle',
            url: 'ui/card/card-basic'
          },
          {
            id: 'card-advance',
            title: 'Advance',
            translate: 'MENU.UI.CARDS.ADVANCE',
            type: 'item',
            icon: 'circle',
            url: 'ui/card/advance'
          },
          {
            id: 'card-statistics',
            title: 'Statistics',
            translate: 'MENU.UI.CARDS.STATISTICS',
            type: 'item',
            icon: 'circle',
            url: 'ui/card/statistics'
          },
          {
            id: 'Card-analytics',
            title: 'Analytics',
            translate: 'MENU.UI.CARDS.ANALYTICS',
            type: 'item',
            icon: 'circle',
            url: 'ui/card/analytics'
          },
          {
            id: 'card-actions',
            title: 'Actions',
            translate: 'MENU.UI.CARDS.ACTIONS',
            type: 'item',
            icon: 'circle',
            url: 'ui/card/actions'
          }
        ]
      },
      {
        id: 'components',
        title: 'Components',
        translate: 'MENU.UI.COMPONENTS.COLLAPSIBLE',
        type: 'collapsible',
        icon: 'archive',
        children: [
          {
            id: 'components-alerts',
            title: 'Alerts',
            translate: 'MENU.UI.COMPONENTS.ALERTS',
            type: 'item',
            icon: 'circle',
            url: 'components/alerts'
          },
          {
            id: 'components-avatar',
            title: 'Avatar',
            translate: 'MENU.UI.COMPONENTS.AVATAR',
            type: 'item',
            icon: 'circle',
            url: 'components/avatar'
          },
          {
            id: 'components-badges',
            title: 'Badges',
            translate: 'MENU.UI.COMPONENTS.BADGES',
            type: 'item',
            icon: 'circle',
            url: 'components/badges'
          },
          {
            id: 'components-breadcrumbs',
            title: 'Breadcrumbs',
            translate: 'MENU.UI.COMPONENTS.BREADCRUMBS',
            type: 'item',
            icon: 'circle',
            url: 'components/breadcrumbs'
          },
          {
            id: 'components-buttons',
            title: 'Buttons',
            translate: 'MENU.UI.COMPONENTS.BUTTONS',
            type: 'item',
            icon: 'circle',
            url: 'components/buttons'
          },
          {
            id: 'components-carousel',
            title: 'Carousel',
            translate: 'MENU.UI.COMPONENTS.CAROUSEL',
            type: 'item',
            icon: 'circle',
            url: 'components/carousel'
          },
          {
            id: 'components-collapse',
            title: 'Collapse',
            translate: 'MENU.UI.COMPONENTS.COLLAPSE',
            type: 'item',
            icon: 'circle',
            url: 'components/collapse'
          },
          {
            id: 'components-divider',
            title: 'Divider',
            translate: 'MENU.UI.COMPONENTS.DIVIDER',
            type: 'item',
            icon: 'circle',
            url: 'components/divider'
          },
          {
            id: 'components-drop-downs',
            title: 'Dropdowns',
            translate: 'MENU.UI.COMPONENTS.DROPDOWNS',
            type: 'item',
            icon: 'circle',
            url: 'components/dropdowns'
          },
          {
            id: 'components-list-group',
            title: 'List Group',
            translate: 'MENU.UI.COMPONENTS.GROUP',
            type: 'item',
            icon: 'circle',
            url: 'components/list-group'
          },
          {
            id: 'components-media-objects',
            title: 'Media Objects',
            translate: 'MENU.UI.COMPONENTS.OBJECTS',
            type: 'item',
            icon: 'circle',
            url: 'components/media-objects'
          },
          {
            id: 'components-modals',
            title: 'Modals',
            translate: 'MENU.UI.COMPONENTS.MODALS',
            type: 'item',
            icon: 'circle',
            url: 'components/modals'
          },
          {
            id: 'components-navs',
            title: 'Navs',
            translate: 'MENU.UI.COMPONENTS.COMPONENT',
            type: 'item',
            icon: 'circle',
            url: 'components/navs'
          },
          {
            id: 'components-pagination',
            title: 'Pagination',
            translate: 'MENU.UI.COMPONENTS.PAGINATION',
            type: 'item',
            icon: 'circle',
            url: 'components/pagination'
          },
          {
            id: 'components-pill-badges',
            title: 'Pill Badges',
            translate: 'MENU.UI.COMPONENTS.PBADGES',
            type: 'item',
            icon: 'circle',
            url: 'components/pill-badges'
          },
          {
            id: 'components-pills',
            title: 'Pills',
            translate: 'MENU.UI.COMPONENTS.PILLS',
            type: 'item',
            icon: 'circle',
            url: 'components/pills'
          },
          {
            id: 'components-popovers',
            title: 'Popovers',
            translate: 'MENU.UI.COMPONENTS.POPOVERS',
            type: 'item',
            icon: 'circle',
            url: 'components/popovers'
          },
          {
            id: 'components-progress',
            title: 'Progress',
            translate: 'MENU.UI.COMPONENTS.PROGRESS',
            type: 'item',
            icon: 'circle',
            url: 'components/progress'
          },
          {
            id: 'components-ratings',
            title: 'Ratings',
            translate: 'MENU.UI.COMPONENTS.RATINGS',
            type: 'item',
            icon: 'circle',
            url: 'components/ratings'
          },
          {
            id: 'components-spinner',
            title: 'Spinner',
            translate: 'MENU.UI.COMPONENTS.SPINNER',
            type: 'item',
            icon: 'circle',
            url: 'components/spinner'
          },
          {
            id: 'components-tabs',
            title: 'Tabs',
            translate: 'MENU.UI.COMPONENTS.TABS',
            type: 'item',
            icon: 'circle',
            url: 'components/tabs'
          },
          {
            id: 'components-timeline',
            title: 'Timeline',
            translate: 'MENU.UI.COMPONENTS.TIMELINE',
            type: 'item',
            icon: 'circle',
            url: 'components/timeline'
          },
          {
            id: 'components-toasts',
            title: 'Toasts',
            translate: 'MENU.UI.COMPONENTS.TOASTS',
            type: 'item',
            icon: 'circle',
            url: 'components/toasts'
          },
          {
            id: 'components-tooltips',
            title: 'Tooltips',
            translate: 'MENU.UI.COMPONENTS.TOOLTIPS',
            type: 'item',
            icon: 'circle',
            url: 'components/tooltips'
          }
        ]
      },
      {
        id: 'extensions',
        title: 'Extension',
        translate: 'MENU.UI.EX.COLLAPSIBLE',
        type: 'collapsible',
        icon: 'plus-circle',
        children: [
          {
            id: 'ex-sweet-alerts',
            title: 'Sweet Alerts',
            translate: 'MENU.UI.EX.SWEET_ALERTS',
            icon: 'circle',
            type: 'item',
            url: '/extensions/sweet-alerts'
          },
          {
            id: 'ex-blockui',
            title: 'BlockUI',
            translate: 'MENU.UI.EX.BLOCKUI',
            icon: 'circle',
            type: 'item',
            url: 'extensions/blockui'
          },
          {
            id: 'ex-toastr',
            title: 'Toastr',
            translate: 'MENU.UI.EX.TOASTER',
            icon: 'circle',
            type: 'item',
            url: 'extensions/toastr'
          },
          {
            id: 'ex-noui-slider',
            title: 'Slider',
            translate: 'MENU.UI.EX.SLIDER',
            icon: 'circle',
            type: 'item',
            url: '/extensions/noui-slider'
          },
          {
            id: 'ex-drag-drop',
            title: 'Drag & Drop',
            translate: 'MENU.UI.EX.DRAGDROP',
            icon: 'circle',
            type: 'item',
            url: 'extensions/drag-drop'
          },
          {
            id: 'ex-tour',
            title: 'Tour',
            translate: 'MENU.UI.EX.TOUR',
            icon: 'circle',
            type: 'item',
            url: 'extensions/tour'
          },
          {
            id: 'ex-clip-board',
            title: 'Clipboard',
            translate: 'MENU.UI.EX.CLIPBOARD',
            icon: 'circle',
            type: 'item',
            url: 'extensions/clipboard'
          },
          {
            id: 'ex-media-player',
            title: 'Media Player',
            translate: 'MENU.UI.EX.MEDIAPLAYER',
            icon: 'circle',
            type: 'item',
            url: 'extensions/media-player'
          },
          {
            id: 'ex-content-menu',
            title: 'Context Menu',
            translate: 'MENU.UI.EX.CONTEXTMENU',
            icon: 'circle',
            type: 'item',
            url: 'extensions/context-menu'
          },
          {
            id: 'ex-swiper',
            title: 'Swiper',
            translate: 'MENU.UI.EX.SWIPER',
            icon: 'circle',
            type: 'item',
            url: 'extensions/swiper'
          },
          {
            id: 'ex-tree-view',
            title: 'Tree View',
            translate: 'MENU.UI.EX.TREEVIEW',
            icon: 'circle',
            type: 'item',
            url: 'extensions/tree-view'
          },
          {
            id: 'i18n',
            title: 'I18n',
            translate: 'MENU.UI.EX.I18N',
            icon: 'circle',
            type: 'item',
            url: '/extensions/i18n'
          }
        ]
      },
      {
        id: 'page-layouts',
        title: 'Page Layouts',
        translate: 'MENU.UI.LAYOUTS.COLLAPSIBLE',
        type: 'collapsible',
        icon: 'layout',
        children: [
          {
            id: 'layout-collapsed-menu',
            title: 'Collapsed Menu',
            translate: 'MENU.UI.LAYOUTS.COLLAPSED_MENU',
            icon: 'circle',
            type: 'item',
            url: 'ui/page-layouts/collapsed-menu'
          },
          {
            id: 'layout-boxed',
            title: 'Boxed Layout',
            translate: 'MENU.UI.LAYOUTS.BOXED_LAYOUT',
            icon: 'circle',
            type: 'item',
            url: 'ui/page-layouts/boxed-layout'
          },
          {
            id: 'layout-without-menu',
            title: 'Without Menu',
            translate: 'MENU.UI.LAYOUTS.WITHOUT_MENU',
            icon: 'circle',
            type: 'item',
            url: 'ui/page-layouts/without-menu'
          },
          {
            id: 'layout-empty',
            title: 'Layout Empty',
            translate: 'MENU.UI.LAYOUTS.LAYOUT_EMPTY',
            icon: 'circle',
            type: 'item',
            url: 'ui/page-layouts/layout-empty'
          },
          {
            id: 'layout-blank',
            title: 'Layout Blank',
            translate: 'MENU.UI.LAYOUTS.LAYOUT_BLANK',
            icon: 'circle',
            type: 'item',
            url: 'ui/page-layouts/layout-blank'
          }
        ]
      }
    ]
  },
  // Forms & Tables
  {
    id: 'forms-table',
    type: 'section',
    title: 'Forms & Tables',
    translate: 'MENU.FT.SECTION',
    icon: 'file-text',
    children: [
      {
        id: 'form-elements',
        title: 'Form Elements',
        translate: 'MENU.FT.ELEMENT.COLLAPSIBLE',
        type: 'collapsible',
        icon: 'copy',
        children: [
          {
            id: 'form-elements-input',
            title: 'Input',
            translate: 'MENU.FT.ELEMENT.INPUT',
            type: 'item',
            icon: 'circle',
            url: 'forms/form-elements/input'
          },
          {
            id: 'form-elements-inputgroups',
            title: 'Input Groups',
            translate: 'MENU.FT.ELEMENT.INPUTGROUPS',
            type: 'item',
            icon: 'circle',
            url: 'forms/form-elements/input-groups'
          },
          {
            id: 'form-elements-inputmask',
            title: 'Input Mask',
            translate: 'MENU.FT.ELEMENT.INPUTMASK',
            type: 'item',
            icon: 'circle',
            url: 'forms/form-elements/input-mask'
          },
          {
            id: 'form-elements-textarea',
            title: 'Textarea',
            translate: 'MENU.FT.ELEMENT.TEXTAREA',
            type: 'item',
            icon: 'circle',
            url: 'forms/form-elements/textarea'
          },
          {
            id: 'form-elements-checkbox',
            title: 'Checkbox',
            translate: 'MENU.FT.ELEMENT.CHECKBOX',
            type: 'item',
            icon: 'circle',
            url: 'forms/form-elements/checkbox'
          },
          {
            id: 'form-elements-radio',
            title: 'Radio',
            translate: 'MENU.FT.ELEMENT.RADIO',
            type: 'item',
            icon: 'circle',
            url: 'forms/form-elements/radio'
          },
          {
            id: 'form-elements-switch',
            title: 'Switch',
            translate: 'MENU.FT.ELEMENT.SWITCH',
            type: 'item',
            icon: 'circle',
            url: 'forms/form-elements/switch'
          },
          {
            id: 'form-elements-select',
            title: 'Select',
            translate: 'MENU.FT.ELEMENT.SELECT',
            type: 'item',
            icon: 'circle',
            url: 'forms/form-elements/select'
          },
          {
            id: 'form-elements-numberInput',
            title: 'Number Input',
            translate: 'MENU.FT.ELEMENT.NUMBERINPUT',
            type: 'item',
            icon: 'circle',
            url: 'forms/form-elements/number-input'
          },
          {
            id: 'form-elements-file-uploader',
            title: 'File Uploader',
            translate: 'MENU.FT.ELEMENT.FILEUPLOADER',
            icon: 'circle',
            type: 'item',
            url: 'forms/form-elements/file-uploader'
          },
          {
            id: 'form-elements-quill-editor',
            title: 'Quill Editor',
            translate: 'MENU.FT.ELEMENT.QUILLEDITOR',
            icon: 'circle',
            type: 'item',
            url: 'forms/form-elements/quill-editor'
          },
          {
            id: 'form-elements-flatpicker',
            title: 'Flatpicker',
            translate: 'MENU.FT.ELEMENT.FLATPICKER',
            type: 'item',
            icon: 'circle',
            url: 'forms/form-elements/flatpickr'
          },
          {
            id: 'form-elements-date-time-icker',
            title: 'Date & Time Picker',
            translate: 'MENU.FT.ELEMENT.DATETIMEPICKER',
            type: 'item',
            icon: 'circle',
            url: 'forms/form-elements/date-time-picker'
          }
        ]
      },
      {
        id: 'form-layouts',
        title: 'Form Layouts',
        translate: 'MENU.FT.LAYOUTS',
        type: 'item',
        icon: 'box',
        url: 'forms/form-layout'
      },
      {
        id: 'form-wizard',
        title: 'Form Wizard',
        translate: 'MENU.FT.WIZARD',
        type: 'item',
        icon: 'package',
        url: 'forms/form-wizard'
      },
      {
        id: 'form-validation',
        title: 'Form Validations',
        translate: 'MENU.FT.VALIDATION',
        type: 'item',
        icon: 'check-circle',
        url: 'forms/form-validation'
      },
      {
        id: 'form-repeater',
        title: 'Form Repeater',
        translate: 'MENU.FT.REPEATER',
        type: 'item',
        icon: 'rotate-cw',
        url: 'forms/form-repeater'
      },
      {
        id: 'tables-table',
        title: 'Table',
        translate: 'MENU.FT.TABLE',
        type: 'item',
        icon: 'server',
        url: 'tables/table'
      },
      {
        id: 'tables-datatable',
        title: 'DataTables',
        translate: 'MENU.FT.DATATABLES',
        type: 'item',
        icon: 'grid',
        url: 'tables/datatables'
      }
    ]
  },
  // Charts & Maps
  {
    id: 'charts-maps',
    type: 'section',
    title: 'Charts & Maps',
    translate: 'MENU.CM.SECTION',
    icon: 'bar-chart-2',
    children: [
      {
        id: 'charts',
        title: 'Charts',
        translate: 'MENU.CM.CHARTS.COLLAPSIBLE',
        type: 'collapsible',
        icon: 'pie-chart',
        badge: {
          title: '2',
          translate: 'MENU.CM.CHARTS.BADGE',
          classes: 'badge-light-danger badge-pill'
        },
        children: [
          {
            id: 'apex',
            title: 'Apex',
            translate: 'MENU.CM.CHARTS.APEX',
            type: 'item',
            icon: 'circle',
            url: 'charts-and-maps/apex'
          },
          {
            id: 'chartJs',
            title: 'ChartJS',
            translate: 'MENU.CM.CHARTS.CHARTJS',
            type: 'item',
            icon: 'circle',
            url: 'charts-and-maps/chartjs'
          }
        ]
      },
      {
        id: 'google-maps',
        title: 'Google Maps',
        translate: 'MENU.CM.MAPS',
        icon: 'map',
        type: 'item',
        url: 'charts-and-maps/google-maps'
      }
    ]
  },
  // Others
  {
    id: 'others',
    type: 'section',
    title: 'Others',
    translate: 'MENU.OTHERS.SECTION',
    icon: 'box',
    children: [
      {
        id: 'menu-levels',
        title: 'Menu Levels',
        translate: 'MENU.OTHERS.LEVELS.COLLAPSIBLE',
        icon: 'menu',
        type: 'collapsible',
        children: [
          {
            id: 'second-level',
            title: 'Second Level',
            translate: 'MENU.OTHERS.LEVELS.SECOND',
            icon: 'circle',
            type: 'item',
            url: '#'
          },
          {
            id: 'second-level1',
            title: 'Second Level',
            translate: 'MENU.OTHERS.LEVELS.SECOND1.COLLAPSIBLE',
            icon: 'circle',
            type: 'collapsible',
            children: [
              {
                id: 'third-level',
                title: 'Third Level',
                translate: 'MENU.OTHERS.LEVELS.SECOND1.THIRD',
                type: 'item',
                url: '#'
              },
              {
                id: 'third-level1',
                title: 'Third Level',
                translate: 'MENU.OTHERS.LEVELS.SECOND1.THIRD1',
                type: 'item',
                url: '#'
              }
            ]
          }
        ]
      },
      {
        id: 'disabled-menu',
        title: 'Disabled Menu',
        translate: 'MENU.OTHERS.DISABLED',
        icon: 'eye-off',
        type: 'item',
        url: '#',
        disabled: true
      },
      {
        id: 'documentation',
        title: 'Documentation',
        translate: 'MENU.OTHERS.DOCUMENTATION',
        icon: 'file-text',
        type: 'item',
        url: 'https://pixinvent.com/demo/vuexy-angular-admin-dashboard-template/documentation',
        externalUrl: true,
        openInNewTab: true
      },
      {
        id: 'raise-support',
        title: 'Raise Support',
        translate: 'MENU.OTHERS.SUPPORT',
        icon: 'life-buoy',
        type: 'item',
        url: 'https://pixinvent.ticksy.com/',
        externalUrl: true,
        openInNewTab: true
      }
    ]
  }*/
];
