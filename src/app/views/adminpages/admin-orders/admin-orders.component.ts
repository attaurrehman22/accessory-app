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

  loadOrders() {
    this.isLoading = true;
    this.http.getAdminOrders(this.pageIndex + 1, this.pageSize).subscribe(
      (res: any) => {
        this.allOrders = res.orders || res.data || [];
        this.totalItems = res.total || res.meta?.total || this.allOrders.length;
        this.applyFilters();
        this.isLoading = false;
      },
      (err: any) => {
        this.isLoading = false;
        const errorMessage =
          err?.error?.message ||
          (this.translateService.currentLang === "en"
            ? "Error loading orders. Please try again"
            : "حدث خطأ أثناء تحميل الطلبات، يرجى المحاولة مرة أخرى");
        this.alertService.showAlert("warning", errorMessage);
      }
    );
  }

  applyFilters() {
    let filtered = [...this.allOrders];

    // Apply status filter
    if (this.statusFilter !== "All") {
      filtered = filtered.filter((order) => order.status === this.statusFilter);
    }

    this.filteredOrders = filtered;
    this.dataSource.data = this.filteredOrders;
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
