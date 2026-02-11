import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { Subscription, forkJoin, of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import * as Highcharts from "highcharts";
import { HttpService } from "src/services/http/http.service";
import { SidebarService } from "src/services/sidebar.service";
import { PermissionCheckService } from "../../services/permission-check.service";
import {
  UserStats,
  ProductStats,
  OrderStats,
  RevenueStats,
  Order,
  OrderFilters,
  ColumnChartOptions,
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
  brandsChartOptions: ColumnChartOptions | null = null;

  // Loading and error states
  isLoading = false;
  hasError = false;
  errorMessage = "";

  // Dashboard statistics
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
  filteredOrders: Order[] = [];
  allOrders: Order[] = [];

  // Filters
  filters: OrderFilters = {
    orderId: null,
    buyerName: "",
    sellerName: "",
    orderStatus: "",
    createdDate: "",
  };

  // Paginated Table - Subscribers
  displayedColumns: string[] = ["email"];
  paginatedTableDataSource: MatTableDataSource<any> = new MatTableDataSource(
    []
  );
  paginatedTableLoading = false;
  paginatedTablePageIndex = 0;
  paginatedTablePageSize = 5;
  paginatedTableTotalItems = 0;
  paginatedTablePageSizeOptions = [5, 10, 25, 50];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  sidebarClickSubscription: Subscription;
  subscribersCount = 0;
  constructor(
    private dialog: MatDialog,
    private sidebarService: SidebarService,
    private toast: AlertsServicesService,
    private http: HttpService,
    private permissionCheckService: PermissionCheckService
  ) {}

  ngOnInit(): void {
    this.getDashboardDetails();
    this.loadPaginatedTableData();
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
        totalUsers: data.users.data?.total_registered_users || 0,
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
    if (data.brands && data.brands.data) {
      // You can set up brands chart data here if needed
      this.setupBrandsChart(data);
    }
  }

  // Initialize orders table data
  initializeOrdersTableData() {
    this.filteredOrders = [...this.allOrders];
  }

  // Setup brands chart (vertical column chart)
  setupBrandsChart(data: any): void {
    const brandNames = Object.keys(data.brands.data) || [];
    const brandValues = (Object.values(data.brands.data) || []) as number[];

    // Fixed height for vertical chart
    const chartHeight = 400;

    this.brandsChartOptions = {
      chart: {
        type: "column",
        height: chartHeight,
        spacingLeft: 10,
        spacingRight: 10,
        spacingTop: 10,
        spacingBottom: 10,
        marginLeft: 50,
        marginRight: 40,
        marginTop: 20,
        marginBottom: 80,
      },
      title: {
        text: "",
      },
      xAxis: {
        categories: brandNames,
        title: {
          text: null,
        },
        labels: {
          enabled: true,
          style: {
            fontSize: "11px",
            fontWeight: "500",
            color: "#495057",
          },
          rotation: -45,
          align: "right",
        },
        lineWidth: 0,
        gridLineWidth: 0,
      },
      yAxis: {
        min: 0,
        title: {
          text: null,
        },
        labels: {
          enabled: true,
          style: {
            fontSize: "10px",
            color: "#6c757d",
          },
        },
        gridLineWidth: 1,
        gridLineColor: "#e9ecef",
        lineWidth: 0,
      },
      tooltip: {
        backgroundColor: "#fff",
        borderColor: "#007bff",
        borderRadius: 6,
        shadow: true,
        useHTML: true,
        headerFormat:
          '<div style="font-size:11px;font-weight:bold;margin-bottom:4px">{point.key}</div>',
        pointFormat:
          '<div style="font-size:12px">Orders: <b style="color:#007bff">{point.y}</b></div>',
        padding: 10,
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
            inside: false,
            align: "center",
            format: "{point.y}",
            style: {
              fontSize: "11px",
              fontWeight: "bold",
              color: "#495057",
              textOutline: "none",
            },
            y: -5,
          },
          borderWidth: 0,
          borderRadius: 3,
          pointWidth: null,
          groupPadding: 0.1,
          pointPadding: 0.2,
        },
      },
      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: "Orders",
          data: brandValues,
          color: "#007bff",
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

      // Filter by Order ID
      if (this.filters.orderId) {
        const orderId = order.orderID;
        if (orderId !== this.filters.orderId) {
          matches = false;
        }
      }

      // Filter by Buyer Name
      if (this.filters.buyerName && this.filters.buyerName.trim()) {
        const buyerName = order.buyerName?.toLowerCase() || "";
        const filterValue = this.filters.buyerName.toLowerCase().trim();
        if (!buyerName.includes(filterValue)) {
          matches = false;
        }
      }

      // Filter by Seller Name
      if (this.filters.sellerName && this.filters.sellerName.trim()) {
        const sellerName = order.sellerName?.toLowerCase() || "";
        const filterValue = this.filters.sellerName.toLowerCase().trim();
        if (!sellerName.includes(filterValue)) {
          matches = false;
        }
      }

      // Filter by Order Status
      if (this.filters.orderStatus && this.filters.orderStatus.trim()) {
        const orderStatus = order.orderStatus?.toLowerCase() || "";
        const filterValue = this.filters.orderStatus.toLowerCase().trim();
        if (orderStatus !== filterValue) {
          matches = false;
        }
      }

      // Filter by Created Date
      if (this.filters.createdDate && this.filters.createdDate.trim()) {
        const orderDate = new Date(order.createdAt || order.orderCreatedAt);
        const filterDate = new Date(this.filters.createdDate);

        // Compare only the date parts (ignore time)
        const orderDateStr = orderDate.toISOString().split("T")[0];
        const filterDateStr = filterDate.toISOString().split("T")[0];

        if (orderDateStr !== filterDateStr) {
          matches = false;
        }
      }

      return matches;
    });
  }

  // Clear all filters
  clearFilters(): void {
    this.filters = {
      orderId: null,
      buyerName: "",
      sellerName: "",
      orderStatus: "",
      createdDate: "",
    };
    this.filteredOrders = [...this.allOrders];
  }

  // Get CSS class for order status badge
  getStatusClass(status: string): string {
    const statusLower = status?.toLowerCase() || "";

    switch (statusLower) {
      case "initiated":
        return "badge-initiated";
      case "confirmed":
        return "badge-confirmed";
      case "preparing":
      case "preparing_shipment":
        return "badge-preparing";
      case "in_transit":
      case "delivery_in_progress":
        return "badge-in_transit";
      case "delivered":
        return "badge-delivered";
      case "cancelled":
        return "badge-cancelled";
      case "pending":
        return "badge-pending";
      default:
        return "badge-secondary";
    }
  }

  // Load paginated table data - Subscribers
  loadPaginatedTableData(): void {
    this.paginatedTableLoading = true;
    this.http
      .getSubscribers(
        this.paginatedTablePageIndex + 1,
        this.paginatedTablePageSize
      )
      .pipe(
        catchError((error) => {
          console.error("Error loading subscribers data:", error);
          this.toast.showAlert("danger", "Failed to load subscribers data");
          this.paginatedTableLoading = false;
          return of(null);
        })
      )
      .subscribe({
        next: (response: any) => {
          if (response) {
            const subscribers = response.data.data || [];
            this.paginatedTableDataSource.data = subscribers;
            this.paginatedTableTotalItems = this.subscribersCount =
              response.data.total || subscribers.length;
          }
          this.paginatedTableLoading = false;
        },
        error: (error) => {
          console.error("Subscribers table loading error:", error);
          this.paginatedTableLoading = false;
        },
      });
  }

  // Handle pagination events
  onPaginatedTablePageChange(event: PageEvent): void {
    this.paginatedTablePageIndex = event.pageIndex;
    this.paginatedTablePageSize = event.pageSize;
    this.loadPaginatedTableData();
  }
}
