import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Subscription, forkJoin, of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import * as Highcharts from "highcharts";
import { HighchartsServiceService } from "src/services/highcharts-service/highcharts-service.service";
import { ChangeDetectorRef } from "@angular/core"; // Import ChangeDetectorRef
import { HttpService } from "src/services/http/http.service";
import { SidebarService } from "src/services/sidebar.service";
import { MatTableDataSource } from "@angular/material/table";
import { PermissionCheckService } from "../../services/permission-check.service";
import {
  UserStats,
  ProductStats,
  OrderStats,
  RevenueStats,
  Order,
  OrderFilters,
  OrderStatus,
  PieChartOptions,
  ColumnChartOptions,
  DashboardData,
  LoadingStates,
  LegacyCardData,
  LegacyDashboardDetails,
  ApiResponse,
} from "./dashboard.types";

@Component({
  selector: "app-admin-home",
  templateUrl: "./admin-home.component.html",
  styleUrls: ["./admin-home.component.css"],
})
export class AdminHomeComponent implements OnInit, OnDestroy {
  // Chart data and options
  Highcharts = Highcharts;
  viewPermission = "admin.dashboard.view";
  usersChartOptions: PieChartOptions | null = null;
  productsChartOptions: PieChartOptions | null = null;
  ordersChartOptions: PieChartOptions | null = null;
  brandsChartOptions: ColumnChartOptions | null = null;

  // Loading and error states
  isLoading = false;
  hasError = false;
  errorMessage = "";
  loadingStates: LoadingStates = {
    users: false,
    products: false,
    orders: false,
    revenue: false,
    brands: false,
  };

  // Dashboard statistics - using interfaces
  userStats: UserStats = {
    totalUsers: 0,
    privateSellers: 0,
    dealers: 0,
  };

  productStats: ProductStats = {
    totalProducts: 0,
    activeProducts: 0,
    inactiveProducts: 0,
    soldProducts: 0,
  };

  orderStats: OrderStats = {
    totalOrders: 0,
    initiatedOrders: 0,
    preparingShipmentOrders: 0,
    confirmedOrders: 0,
    cancelledOrders: 0,
    deliveryInProgressOrders: 0,
    awaitingConfirmationOrders: 0,
  };

  revenueStats: RevenueStats = {
    confirmedPayments: 0,
    deliveredOrders: 0,
    pendingDeliveryOrders: 0,
    ordersInDispute: 0,
  };

  // Orders table
  ordersDisplayedColumns: string[] = [
    "orderId",
    "buyerName",
    "sellerName",
    "orderStatus",
    "orderCreatedAt",
  ];
  ordersDataSource = new MatTableDataSource<Order>([]);
  filteredOrders: Order[] = [];
  allOrders: Order[] = [];

  // Filters
  filters: OrderFilters = {
    orderId: "",
    buyerName: "",
    sellerName: "",
    orderStatus: "",
    createdDate: "",
  };

  displayedColumns: string[] = ["id", "name", "email"];
  dataSource = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com" },
  ];
  linechart: any; // Will be typed when we know the structure
  dashboarddetails: LegacyDashboardDetails = {
    totalNumberOfBrands: 0,
    totalNumberOfBrandsWithActiveSubscription: 0,
    totalNumberOfCatagory: 0,
    activeBrandsCount: 0,
    topBrandsCount: 0,
    totalNumberOfUsers: 0,
    totalNumberOfUsersWithActiveSubscription: 0,
    totalNumberOfUsersWithSubscription: 0,
    totalNumberOfUsersWithoutSubscription: 0,
    totalNumberOfProducts: 0,
  };

  sidebarClickSubscription: Subscription;

  constructor(
    private dialog: MatDialog,
    private sidebarService: SidebarService,
    private toast: AlertsServicesService,
    private highchartsService: HighchartsServiceService,
    private cd: ChangeDetectorRef,
    private http: HttpService,
    private permissionCheckService: PermissionCheckService
  ) {}
  ngOnInit(): void {
    this.getDashboardDetails();
    this.sidebarClickSubscription = this.sidebarService.sidebarClick$.subscribe(
      () => {
        this.dialog.closeAll();
      }
    );
  }

  doPermissionCheck() {
    if (!this.permissionCheckService.checkPermission(this.viewPermission)) {
      this.toast.showAlert(
        "danger",
        "You are not authorized to access this page"
      );
      return false;
    }
    return true;
  }

  ngOnDestroy() {
    if (this.sidebarClickSubscription) {
      this.sidebarClickSubscription.unsubscribe();
    }
  }

  getDashboardDetails() {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    // Load all dashboard data in parallel with proper error handling
    forkJoin({
      users: this.http.getAdminDashboardUsers().pipe(
        catchError((error) => {
          console.error("Error loading users data:", error);
          this.toast.showAlert("danger", "Failed to load users data");
          return of(null);
        })
      ),
      products: this.http.getAdminDashboardProducts().pipe(
        catchError((error) => {
          console.error("Error loading products data:", error);
          this.toast.showAlert("danger", "Failed to load products data");
          return of(null);
        })
      ),
      orders: this.http.getAdminDashboardOrders().pipe(
        catchError((error) => {
          console.error("Error loading orders data:", error);
          this.toast.showAlert("danger", "Failed to load orders data");
          return of(null);
        })
      ),
      revenue: this.http.getAdminDashboardRevenue().pipe(
        catchError((error) => {
          console.error("Error loading revenue data:", error);
          this.toast.showAlert("danger", "Failed to load revenue data");
          return of(null);
        })
      ),
      brands: this.http.getAdminDashboardOrdersByBrand().pipe(
        catchError((error) => {
          console.error("Error loading brands data:", error);
          this.toast.showAlert("danger", "Failed to load brands data");
          return of(null);
        })
      ),
    })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (data) => {
          this.processDashboardData(data);
          this.setupCharts();
        },
        error: (error) => {
          console.error("Dashboard loading error:", error);
          this.hasError = true;
          this.errorMessage =
            "Failed to load dashboard data. Please try again.";
          this.toast.showAlert("danger", this.errorMessage);
        },
      });
  }

  private processDashboardData(data: any) {
    // Process users data
    if (data.users) {
      this.userStats = {
        totalUsers: data.users.data?.total_registered_users || 0, // Using dummy value as requested
        privateSellers: data.users.data?.private_sellers || 0,
        dealers: data.users.data?.dealers || 0,
      };
    }

    // Process products data
    if (data.products) {
      this.productStats = {
        totalProducts: data.products.data?.total_products || 0,
        activeProducts: data.products.data?.active_products || 0,
        inactiveProducts: data.products.data?.inactive_products || 0,
        soldProducts: data.products.data?.sold_products || 0,
      };
    }

    // Process orders data
    if (data.orders) {
      this.allOrders = data.orders.data?.allOrders || [];
      this.initializeOrdersTableData();
      this.orderStats = {
        totalOrders: data.orders.data?.totalOrders || 0,
        initiatedOrders: data.orders.data?.initiatedOrders || 0,
        preparingShipmentOrders: data.orders.data?.preparingShipmentOrders || 0,
        confirmedOrders: data.orders.data?.orderConfirmOrders || 0,
        cancelledOrders: data.orders.data?.orderCanceledOrders || 0,
        deliveryInProgressOrders:
          data.orders.data?.deliveryInProgressOrders || 0,
        awaitingConfirmationOrders:
          data.orders.data?.awaitingConfirmationOrders || 0,
      };
    }

    // Process revenue data
    if (data.revenue) {
      this.revenueStats = {
        confirmedPayments: data.revenue.data?.confirmedPayments || 0,
        deliveredOrders: data.revenue.data?.deliveredOrders || 0,
        pendingDeliveryOrders: data.revenue.data?.pendingDelivery || 0,
        ordersInDispute: data.revenue.data?.disputeOrders || 0,
      };
    }

    // Process brands data
    if (data.brands) {
      this.brandsChartOptions = data.brands.data?.totalNumberOfBrands || 0;
    }
  }

  loadHighcharts() {
    // Keep the existing linechart for compatibility if needed
    this.linechart = this.highchartsService.getLineChartOptions();
    this.cd.detectChanges();
  }

  // Initialize dummy data for all components
  initializeOrdersTableData() {
    this.filteredOrders = [...this.allOrders];
    this.ordersDataSource.data = this.filteredOrders;
  }

  // Setup all chart configurations
  setupCharts() {
    try {
      this.setupUsersChart();
      this.setupProductsChart();
      this.setupOrdersChart();
      this.setupBrandsChart();
    } catch (error) {
      console.error("Error setting up charts:", error);
    }
  }

  // Users pie chart (Private Sellers vs Dealers)
  setupUsersChart(): void {
    this.usersChartOptions = {
      chart: {
        type: "pie",
        height: 200,
        margin: [20, 20, 20, 20],
      },
      title: {
        text: "",
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.y}</b>",
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "{point.name}: {point.y}",
            style: {
              fontSize: "12px",
              fontWeight: "bold",
            },
          },
          showInLegend: false,
        },
      },
      series: [
        {
          name: "Users",
          colorByPoint: true,
          data: [
            {
              name: "Private Sellers",
              y: this.userStats.privateSellers,
              color: "#3498db",
            },
            {
              name: "Dealers",
              y: this.userStats.dealers,
              color: "#e74c3c",
            },
          ],
        },
      ],
    };
  }

  // Products pie chart (Active, Inactive, Sold)
  setupProductsChart(): void {
    this.productsChartOptions = {
      chart: {
        type: "pie",
        height: 200,
        margin: [20, 20, 20, 20],
      },
      title: {
        text: "",
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.y}</b>",
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "{point.name}: {point.y}",
            style: {
              fontSize: "12px",
              fontWeight: "bold",
            },
          },
          showInLegend: false,
        },
      },
      series: [
        {
          name: "Listings",
          colorByPoint: true,
          data: [
            {
              name: "Active",
              y: this.productStats.activeProducts,
              color: "#2ecc71",
            },
            {
              name: "Inactive",
              y: this.productStats.inactiveProducts,
              color: "#f39c12",
            },
            {
              name: "Sold",
              y: this.productStats.soldProducts,
              color: "#9b59b6",
            },
          ],
        },
      ],
    };
  }

  // Orders pie chart (Different order types)
  setupOrdersChart(): void {
    this.ordersChartOptions = {
      chart: {
        type: "pie",
        height: 200,
        margin: [20, 20, 20, 20],
      },
      title: {
        text: "",
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.y}</b>",
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "{point.name}: {point.y}",
            style: {
              fontSize: "12px",
              fontWeight: "bold",
            },
          },
          showInLegend: false,
        },
      },
      series: [
        {
          name: "Orders",
          colorByPoint: true,
          data: [
            {
              name: "Initiated Orders",
              y: this.orderStats.initiatedOrders,
              color: "#3498db",
            },
            {
              name: "Preparing Shipment Orders",
              y: this.orderStats.preparingShipmentOrders,
              color: "#e74c3c",
            },
            {
              name: "Confirmed Orders",
              y: this.orderStats.confirmedOrders,
              color: "#2ecc71",
            },
            {
              name: "Cancelled Orders",
              y: this.orderStats.cancelledOrders,
              color: "#f39c12",
            },
            {
              name: "Delivery In Progress Orders",
              y: this.orderStats.deliveryInProgressOrders,
              color: "#9b59b6",
            },
            {
              name: "Awaiting Confirmation Orders",
              y: this.orderStats.awaitingConfirmationOrders,
              color: "#e74c3c",
            },
            {
              name: "Delivered Orders",
              y: this.revenueStats.deliveredOrders,
              color: "#2ecc71",
            },
          ],
        },
      ],
    };
  }

  // Brands bar chart
  setupBrandsChart(): void {
    this.brandsChartOptions = {
      chart: {
        type: "column",
        height: 400,
        margin: [20, 20, 20, 20],
      },
      title: {
        text: "",
      },
      xAxis: {
        categories: [
          "TechDeals Inc",
          "ElectroMart",
          "GadgetWorld",
          "SmartTech",
          "DigitalHub",
          "TechZone",
        ],
        title: {
          text: "Brands",
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: "Number of Orders",
        },
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y}</b></td></tr>',
        footerFormat: "</table>",
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      series: [
        {
          name: "Orders",
          data: [45, 38, 32, 28, 22, 18],
          color: "#3498db",
        },
      ],
    };
  }

  // Retry loading dashboard data
  retryLoadDashboard() {
    this.getDashboardDetails();
  }

  // Apply filters to orders table
  applyFilters(): void {
    this.filteredOrders = this.allOrders.filter((order: Order) => {
      let matches = true;

      if (
        this.filters.orderId &&
        !order.orderID
          .toLowerCase()
          .includes(this.filters.orderId.toLowerCase())
      ) {
        matches = false;
      }

      if (
        this.filters.buyerName &&
        !order.buyerName
          .toLowerCase()
          .includes(this.filters.buyerName.toLowerCase())
      ) {
        matches = false;
      }

      if (
        this.filters.sellerName &&
        !order.sellerName
          .toLowerCase()
          .includes(this.filters.sellerName.toLowerCase())
      ) {
        matches = false;
      }

      if (
        this.filters.orderStatus &&
        order.orderStatus !== this.filters.orderStatus
      ) {
        matches = false;
      }

      if (this.filters.createdDate) {
        const orderDate = new Date(order.createdAt || order.orderCreatedAt)
          .toISOString()
          .split("T")[0];
        if (orderDate !== this.filters.createdDate) {
          matches = false;
        }
      }

      return matches;
    });

    this.ordersDataSource.data = this.filteredOrders;
  }
}
