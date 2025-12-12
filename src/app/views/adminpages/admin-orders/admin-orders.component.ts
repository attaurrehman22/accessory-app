import { Component, ViewChild, OnInit, OnDestroy } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { HttpService } from "src/services/http/http.service";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { Subscription } from "rxjs";
import { SidebarService } from "src/services/sidebar.service";
import { AdminOrderDetailsComponent } from "../admin-order-details/admin-order-details.component";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "src/environments/environment";

export interface OrderData {
  id: number;
  buyer_id: number;
  seller_id: number;
  product_id: number;
  status: string;
  created_at: string;
  buyer?: any;
  seller?: any;
  product?: any;
}

@Component({
  selector: "app-admin-orders",
  templateUrl: "./admin-orders.component.html",
  styleUrls: ["./admin-orders.component.css"],
})
export class AdminOrdersComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    "id",
    "buyer",
    "seller",
    "product",
    "status",
    "created_at",
    "actions",
  ];

  dataSource: MatTableDataSource<OrderData>;
  allOrders: any[] = [];
  filteredOrders: any[] = [];
  pageSize = 10;
  pageIndex = 0;
  totalItems = 0;
  isLoading = false;
  apiUrl = environment.apipath + "/";

  statusFilter: string = "All";

  statusOptions = [
    { value: "All", label: "All Status" },
    { value: "initiated", label: "Initiated" },
    { value: "awaiting_confirmation", label: "Awaiting Confirmation" },
    { value: "make_payment", label: "Make Payment" },
    { value: "preparing_shipment", label: "Preparing Shipment" },
    { value: "delivery_in_progress", label: "Delivery in Progress" },
    { value: "order_delivered", label: "Order Delivered" },
    { value: "order_completed", label: "Order Completed" },
    { value: "order_canceled", label: "Order Canceled" },
    { value: "order_sold", label: "Order Sold" },
  ];

  supportLanguages = ["en", "ar", "fr", "ta", "hi"];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  sidebarClickSubscription: Subscription;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private http: HttpService,
    private alertService: AlertsServicesService,
    private sidebarService: SidebarService,
    public translateService: TranslateService
  ) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit(): void {
    this.loadOrders();
    this.sidebarClickSubscription = this.sidebarService.sidebarClick$.subscribe(
      () => {
        this.dialog.closeAll();
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    if (this.sidebarClickSubscription) {
      this.sidebarClickSubscription.unsubscribe();
    }
  }

  async loadOrders() {
    this.isLoading = true;
    try {
      // TODO: Replace with actual API call when backend is ready
      // const res: any = await this.http.getAdminOrders(this.pageIndex + 1, this.pageSize).toPromise();
      // this.allOrders = res.orders || res.data || [];
      // this.totalItems = res.total || res.meta?.total || this.allOrders.length;

      // Dummy data for testing
      await this.loadDummyData();
      this.applyFilters();
    } catch (err: any) {
      if (err && err.error) {
        this.alertService.showAlert("warning", `${err.error.message || "Error loading orders"}`);
      } else {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("warning", "Error loading orders. Please try again");
        } else {
          this.alertService.showAlert("warning", "حدث خطأ أثناء تحميل الطلبات، يرجى المحاولة مرة أخرى");
        }
      }
    } finally {
      this.isLoading = false;
    }
  }

  loadDummyData() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.allOrders = [
          {
            id: 3354654654526,
            buyer_id: 101,
            seller_id: 202,
            product_id: 501,
            status: "awaiting_confirmation",
            created_at: "2024-01-20T10:30:00Z",
            buyer: { name: "John Doe", email: "john@example.com" },
            seller: { name: "Jane Smith", email: "jane@example.com" },
            product: { title: "Rolex Speedmaster", price: 2500, main_image: "watch1.jpg" },
          },
          {
            id: 3354654654527,
            buyer_id: 203,
            seller_id: 101,
            product_id: 502,
            status: "make_payment",
            created_at: "2024-01-19T14:20:00Z",
            buyer: { name: "Alice Johnson", email: "alice@example.com" },
            seller: { name: "John Doe", email: "john@example.com" },
            product: { title: "Omega Seamaster", price: 3200, main_image: "watch2.jpg" },
          },
          {
            id: 3354654654528,
            buyer_id: 202,
            seller_id: 301,
            product_id: 503,
            status: "delivery_in_progress",
            created_at: "2024-01-18T09:15:00Z",
            buyer: { name: "Jane Smith", email: "jane@example.com" },
            seller: { name: "Bob Williams", email: "bob@example.com" },
            product: { title: "Tag Heuer Carrera", price: 1800, main_image: "watch3.jpg" },
          },
          {
            id: 3354654654529,
            buyer_id: 301,
            seller_id: 202,
            product_id: 504,
            status: "order_completed",
            created_at: "2024-01-17T16:45:00Z",
            buyer: { name: "Bob Williams", email: "bob@example.com" },
            seller: { name: "Jane Smith", email: "jane@example.com" },
            product: { title: "Patek Philippe", price: 15000, main_image: "watch4.jpg" },
          },
          {
            id: 3354654654530,
            buyer_id: 401,
            seller_id: 203,
            product_id: 505,
            status: "order_canceled",
            created_at: "2024-01-16T11:30:00Z",
            buyer: { name: "Charlie Brown", email: "charlie@example.com" },
            seller: { name: "Alice Johnson", email: "alice@example.com" },
            product: { title: "Audemars Piguet", price: 12000, main_image: "watch5.jpg" },
          },
        ];
        this.totalItems = this.allOrders.length;
        resolve(null);
      }, 500);
    });
  }

  applyFilters() {
    let filtered = [...this.allOrders];

    // Apply status filter
    if (this.statusFilter !== "All") {
      filtered = filtered.filter((order) => order.status === this.statusFilter);
    }

    this.filteredOrders = filtered;
    this.dataSource.data = this.filteredOrders.slice(
      this.pageIndex * this.pageSize,
      (this.pageIndex + 1) * this.pageSize
    );
  }

  onStatusFilterChange() {
    this.pageIndex = 0;
    this.applyFilters();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilters();
  }

  viewDetails(order: any) {
    const dialogRef = this.dialog.open(AdminOrderDetailsComponent, {
      width: "90%",
      maxWidth: "1200px",
      height: "90vh",
      data: { orderId: order.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === "updated") {
        this.loadOrders();
      }
    });
  }

  getStatusClass(status: string): string {
    const statusMap: any = {
      initiated: "badge-info",
      awaiting_confirmation: "badge-warning",
      make_payment: "badge-primary",
      preparing_shipment: "badge-info",
      delivery_in_progress: "badge-primary",
      order_delivered: "badge-success",
      order_completed: "badge-success",
      order_canceled: "badge-danger",
      order_sold: "badge-secondary",
    };
    return statusMap[status] || "badge-secondary";
  }

  formatDate(date: string): string {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
}

