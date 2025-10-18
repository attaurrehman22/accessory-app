import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import * as Highcharts from "highcharts";
import { HighchartsServiceService } from "src/services/highcharts-service/highcharts-service.service";
import { ChangeDetectorRef } from "@angular/core"; // Import ChangeDetectorRef
import { HttpService } from "src/services/http/http.service";
import { SidebarService } from "src/services/sidebar.service";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-admin-home",
  templateUrl: "./admin-home.component.html",
  styleUrls: ["./admin-home.component.css"],
})
export class AdminHomeComponent implements OnInit, OnDestroy {
  // Chart data and options
  Highcharts = Highcharts;
  usersChartOptions: any = null;
  productsChartOptions: any = null;
  ordersChartOptions: any = null;
  brandsChartOptions: any = null;

  // Dashboard statistics
  totalUsers: number = 0;
  totalListings: number = 0;
  totalOrders: number = 0;
  confirmedPayments: number = 0;
  deliveredOrders: number = 0;
  pendingDeliveryOrders: number = 0;
  ordersInDispute: number = 0;

  // Orders table
  ordersDisplayedColumns: string[] = [
    "orderId",
    "buyerName",
    "sellerName",
    "orderStatus",
    "orderCreatedAt",
  ];
  ordersDataSource = new MatTableDataSource<any>([]);
  filteredOrders: any[] = [];
  allOrders: any[] = [];

  // Filters
  filters = {
    orderId: "",
    buyerName: "",
    sellerName: "",
    orderStatus: "",
    createdDate: "",
  };

  // Legacy data (keeping for compatibility)
  cardData = {
    totalUsers: 0,
    totalPlayers: 0,
    presentPlayers: 0,
    totalPlayersWhoPaidFee: 0,
  };

  displayedColumns: string[] = ["id", "name", "email"];
  dataSource = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com" },
  ];
  linechart: any;
  dashboarddetails = {
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
    private http: HttpService
  ) {}
  ngOnInit(): void {
    this.getDashboardDetails();
    this.getDashBoardCardInfo();
    this.initializeDummyData();
    this.setupCharts();
    this.loadHighcharts();
    this.sidebarClickSubscription = this.sidebarService.sidebarClick$.subscribe(
      () => {
        this.dialog.closeAll();
      }
    );
  }

  ngOnDestroy() {
    if (this.sidebarClickSubscription) {
      this.sidebarClickSubscription.unsubscribe();
    }
  }

  getDashboardDetails() {
    this.http.getAdminDashBoardDetails().subscribe((res) => {
      this.dashboarddetails = res.data;
    });
  }

  loadHighcharts() {
    // Keep the existing linechart for compatibility if needed
    this.linechart = this.highchartsService.getLineChartOptions();
    this.cd.detectChanges();
  }

  getDashBoardCardInfo() {}

  // Initialize dummy data for all components
  initializeDummyData() {
    // Users data
    this.totalUsers = 1250;

    // Products data
    this.totalListings = 3420;

    // Orders data
    this.totalOrders = 890;

    // Revenue data
    this.confirmedPayments = 756;
    this.deliveredOrders = 623;
    this.pendingDeliveryOrders = 134;
    this.ordersInDispute = 12;

    // Orders table data
    this.allOrders = [
      {
        orderId: "ORD001",
        buyerName: "John Smith",
        sellerName: "TechDeals Inc",
        orderStatus: "delivered",
        orderCreatedAt: new Date("2024-01-15"),
      },
      {
        orderId: "ORD002",
        buyerName: "Sarah Johnson",
        sellerName: "ElectroMart",
        orderStatus: "pending",
        orderCreatedAt: new Date("2024-01-16"),
      },
      {
        orderId: "ORD003",
        buyerName: "Mike Brown",
        sellerName: "GadgetWorld",
        orderStatus: "shipped",
        orderCreatedAt: new Date("2024-01-17"),
      },
      {
        orderId: "ORD004",
        buyerName: "Emily Davis",
        sellerName: "TechDeals Inc",
        orderStatus: "confirmed",
        orderCreatedAt: new Date("2024-01-18"),
      },
      {
        orderId: "ORD005",
        buyerName: "David Wilson",
        sellerName: "ElectroMart",
        orderStatus: "dispute",
        orderCreatedAt: new Date("2024-01-19"),
      },
      {
        orderId: "ORD006",
        buyerName: "Lisa Anderson",
        sellerName: "GadgetWorld",
        orderStatus: "delivered",
        orderCreatedAt: new Date("2024-01-20"),
      },
      {
        orderId: "ORD007",
        buyerName: "Tom Miller",
        sellerName: "TechDeals Inc",
        orderStatus: "cancelled",
        orderCreatedAt: new Date("2024-01-21"),
      },
      {
        orderId: "ORD008",
        buyerName: "Anna Garcia",
        sellerName: "ElectroMart",
        orderStatus: "pending",
        orderCreatedAt: new Date("2024-01-22"),
      },
      {
        orderId: "ORD009",
        buyerName: "Chris Lee",
        sellerName: "GadgetWorld",
        orderStatus: "shipped",
        orderCreatedAt: new Date("2024-01-23"),
      },
      {
        orderId: "ORD010",
        buyerName: "Rachel Taylor",
        sellerName: "TechDeals Inc",
        orderStatus: "delivered",
        orderCreatedAt: new Date("2024-01-24"),
      },
    ];

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
  setupUsersChart() {
    const privateSellers = 750;
    const dealers = 500;

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
              y: privateSellers,
              color: "#3498db",
            },
            {
              name: "Dealers",
              y: dealers,
              color: "#e74c3c",
            },
          ],
        },
      ],
    };
  }

  // Products pie chart (Active, Inactive, Sold)
  setupProductsChart() {
    const active = 2100;
    const inactive = 890;
    const sold = 430;

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
              y: active,
              color: "#2ecc71",
            },
            {
              name: "Inactive",
              y: inactive,
              color: "#f39c12",
            },
            {
              name: "Sold",
              y: sold,
              color: "#9b59b6",
            },
          ],
        },
      ],
    };
  }

  // Orders pie chart (Different order types)
  setupOrdersChart() {
    const onlineOrders = 520;
    const phoneOrders = 180;
    const walkInOrders = 90;
    const bulkOrders = 100;

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
              name: "Online Orders",
              y: onlineOrders,
              color: "#3498db",
            },
            {
              name: "Phone Orders",
              y: phoneOrders,
              color: "#e74c3c",
            },
            {
              name: "Walk-in Orders",
              y: walkInOrders,
              color: "#2ecc71",
            },
            {
              name: "Bulk Orders",
              y: bulkOrders,
              color: "#f39c12",
            },
          ],
        },
      ],
    };
  }

  // Brands bar chart
  setupBrandsChart() {
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

  // Apply filters to orders table
  applyFilters() {
    this.filteredOrders = this.allOrders.filter((order) => {
      let matches = true;

      if (
        this.filters.orderId &&
        !order.orderId
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
        const orderDate = new Date(order.orderCreatedAt)
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
