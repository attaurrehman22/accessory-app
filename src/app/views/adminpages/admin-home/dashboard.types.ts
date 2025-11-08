// Dashboard Types and Interfaces

export interface UserStats {
  totalUsers: number;
  privateSellers: number;
  dealers: number;
}

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  soldProducts: number;
}

export interface OrderStats {
  totalOrders: number;
  initiatedOrders: number;
  preparingShipmentOrders: number;
  confirmedOrders: number;
  cancelledOrders: number;
  deliveryInProgressOrders: number;
  awaitingConfirmationOrders: number;
}

export interface RevenueStats {
  confirmedPayments: number;
  deliveredOrders: number;
  pendingDeliveryOrders: number;
  ordersInDispute: number;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "dispute"
  | "initiated"
  | "preparing_shipment"
  | "delivery_in_progress"
  | "awaiting_confirmation";

export interface Order {
  orderID: string;
  buyerName: string;
  sellerName: string;
  orderStatus: OrderStatus;
  createdAt: string; // Updated to match new API structure
  orderCreatedAt: string; // Keep for backward compatibility
}

export interface OrderFilters {
  orderId: string;
  buyerName: string;
  sellerName: string;
  orderStatus: string;
  createdDate: string;
}

export interface ChartData {
  name: string;
  y: number;
  color?: string;
}

export interface PieChartOptions {
  chart: {
    type: "pie";
    height: number;
    margin: number[];
  };
  title: {
    text: string;
  };
  tooltip: {
    pointFormat: string;
  };
  plotOptions: {
    pie: {
      allowPointSelect: boolean;
      cursor: string;
      dataLabels: {
        enabled: boolean;
        format: string;
        style: {
          fontSize: string;
          fontWeight: string;
        };
      };
      showInLegend: boolean;
    };
  };
  series: Array<{
    name: string;
    colorByPoint: boolean;
    data: ChartData[];
  }>;
}

export interface ColumnChartOptions {
  chart: {
    type: "column";
    height: number;
    margin: number[];
  };
  title: {
    text: string;
  };
  xAxis: {
    categories: string[];
    title: {
      text: string;
    };
  };
  yAxis: {
    min: number;
    title: {
      text: string;
    };
  };
  tooltip: {
    headerFormat: string;
    pointFormat: string;
    footerFormat: string;
    shared: boolean;
    useHTML: boolean;
  };
  plotOptions: {
    column: {
      pointPadding: number;
      borderWidth: number;
    };
  };
  series: Array<{
    name: string;
    data: number[];
    color: string;
  }>;
}

export interface DashboardData {
  data?: {
    dealers?: number;
    private_sellers?: number;
    total_products?: number;
    total_registered_users?: number;
    active_products?: number;
    inactive_products?: number;
    sold_products?: number;
    totalOrders?: number;
    initiatedOrders?: number;
    orderConfirmOrders?: number;
    preparingShipmentOrders?: number;
    deliveryInProgressOrders?: number;
    awaitingConfirmationOrders?: number;
    allOrders?: Order[];
    confirmedPayments?: number;
    deliveryOrders?: number;
    pendingDelivery?: number;
    disputeOrders?: number;
    orderCanceledOrders?: number;
    totalNumberOfBrands?: number;
  };
}

export interface LoadingStates {
  users: boolean;
  products: boolean;
  orders: boolean;
  revenue: boolean;
  brands: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

// Legacy interfaces for backward compatibility
export interface LegacyCardData {
  totalUsers: number;
  totalPlayers: number;
  presentPlayers: number;
  totalPlayersWhoPaidFee: number;
}

export interface LegacyDashboardDetails {
  totalNumberOfBrands: number;
  totalNumberOfBrandsWithActiveSubscription: number;
  totalNumberOfCatagory: number;
  activeBrandsCount: number;
  topBrandsCount: number;
  totalNumberOfUsers: number;
  totalNumberOfUsersWithActiveSubscription: number;
  totalNumberOfUsersWithSubscription: number;
  totalNumberOfUsersWithoutSubscription: number;
  totalNumberOfProducts: number;
}
