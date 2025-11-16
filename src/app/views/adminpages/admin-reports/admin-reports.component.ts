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
import { ReportDetailsComponent } from "../report-details/report-details.component";
import { TranslateService } from "@ngx-translate/core";

export interface ReportData {
  id: number;
  reporter_id: number;
  reported_user_id: number;
  order_id: number | null;
  type: string;
  description: string;
  status: string;
  created_at: string;
  reporter?: any;
  reported_user?: any;
  order?: any;
}

@Component({
  selector: "app-admin-reports",
  templateUrl: "./admin-reports.component.html",
  styleUrls: ["./admin-reports.component.css"],
})
export class AdminReportsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    "id",
    "order_id",
    "reporter",
    "reported_user",
    "type",
    "status",
    "created_at",
    "actions",
  ];

  dataSource: MatTableDataSource<ReportData>;
  allReports: any[] = [];
  filteredReports: any[] = [];
  pageSize = 10;
  pageIndex = 0;
  totalItems = 0;
  isLoading = false;

  statusFilter: string = "All";
  typeFilter: string = "All";

  statusOptions = [
    { value: "All", label: "All Status" },
    { value: "Pending", label: "Pending" },
    { value: "Under Review", label: "Under Review" },
    { value: "Resolved", label: "Resolved" },
    { value: "Rejected", label: "Rejected" },
    { value: "Info Requested", label: "Info Requested" },
    { value: "Suspended", label: "Suspended" },
    { value: "Warned", label: "Warned" },
  ];

  typeOptions = [
    { value: "All", label: "All Types" },
    { value: "Product Issue", label: "Product Issue" },
    { value: "Payment Issue", label: "Payment Issue" },
    { value: "Fraud", label: "Fraud" },
    { value: "Harassment", label: "Harassment" },
    { value: "Other", label: "Other" },
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
    this.loadReports();
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

  async loadReports() {
    this.isLoading = true;
    try {
      // TODO: Replace with actual API call when backend is ready
      // const res: any = await this.http.getAdminReports(this.pageIndex + 1, this.pageSize).toPromise();
      // this.allReports = res.reports || res.data || [];
      // this.totalItems = res.total || res.meta?.total || this.allReports.length;
      
      // Dummy data for testing
      await this.loadDummyData();
      this.applyFilters();
    } catch (err: any) {
      if (err && err.error) {
        this.alertService.showAlert("warning", `${err.error.message || "Error loading reports"}`);
      } else {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("warning", "Error loading reports. Please try again");
        } else {
          this.alertService.showAlert("warning", "حدث خطأ أثناء تحميل التقارير، يرجى المحاولة مرة أخرى");
        }
      }
    } finally {
      this.isLoading = false;
    }
  }

  loadDummyData() {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        this.allReports = [
          {
            id: 1,
            reporter_id: 101,
            reported_user_id: 202,
            order_id: 501,
            type: "Fraud",
            description: "Seller took payment but never shipped the watch. I paid on 15th January but haven't received any update or product.",
            status: "Pending",
            created_at: "2024-01-20T10:30:00Z",
            reporter: { name: "John Doe", email: "john@example.com", type: "user" },
            reported_user: { name: "Jane Smith", email: "jane@example.com", type: "dealer" },
            order: { id: 501, status: "pending", product: { name: "Rolex Submariner" } },
            attachments: ["proof1.png", "proof2.jpg"]
          },
          {
            id: 2,
            reporter_id: 203,
            reported_user_id: 101,
            order_id: 502,
            type: "Product Issue",
            description: "The watch received is different from what was described. The condition is poor and doesn't match the photos.",
            status: "Under Review",
            created_at: "2024-01-19T14:20:00Z",
            reporter: { name: "Alice Johnson", email: "alice@example.com", type: "user" },
            reported_user: { name: "John Doe", email: "john@example.com", type: "dealer" },
            order: { id: 502, status: "delivered", product: { name: "Omega Speedmaster" } },
            attachments: ["comparison.jpg"]
          },
          {
            id: 3,
            reporter_id: 202,
            reported_user_id: 301,
            order_id: null,
            type: "Harassment",
            description: "The buyer is sending inappropriate messages and threatening me. Please take action.",
            status: "Resolved",
            created_at: "2024-01-18T09:15:00Z",
            reporter: { name: "Jane Smith", email: "jane@example.com", type: "dealer" },
            reported_user: { name: "Bob Williams", email: "bob@example.com", type: "user" },
            order: null,
            attachments: ["messages.png"]
          },
          {
            id: 4,
            reporter_id: 301,
            reported_user_id: 202,
            order_id: 503,
            type: "Payment Issue",
            description: "Payment was deducted but order was cancelled. I haven't received my refund yet.",
            status: "Info Requested",
            created_at: "2024-01-17T16:45:00Z",
            reporter: { name: "Bob Williams", email: "bob@example.com", type: "user" },
            reported_user: { name: "Jane Smith", email: "jane@example.com", type: "dealer" },
            order: { id: 503, status: "cancelled", product: { name: "Tag Heuer Carrera" } },
            attachments: ["payment_receipt.pdf"]
          },
          {
            id: 5,
            reporter_id: 401,
            reported_user_id: 203,
            order_id: 504,
            type: "Fraud",
            description: "Seller is using fake product images and selling counterfeit watches.",
            status: "Suspended",
            created_at: "2024-01-16T11:30:00Z",
            reporter: { name: "Charlie Brown", email: "charlie@example.com", type: "user" },
            reported_user: { name: "Alice Johnson", email: "alice@example.com", type: "dealer" },
            order: { id: 504, status: "pending", product: { name: "Patek Philippe" } },
            attachments: ["fake1.jpg", "fake2.jpg", "authentic_comparison.png"]
          },
          {
            id: 6,
            reporter_id: 203,
            reported_user_id: 401,
            order_id: 505,
            type: "Other",
            description: "The seller is not responding to messages and ignoring my requests for product information.",
            status: "Warned",
            created_at: "2024-01-15T13:20:00Z",
            reporter: { name: "Alice Johnson", email: "alice@example.com", type: "dealer" },
            reported_user: { name: "Charlie Brown", email: "charlie@example.com", type: "user" },
            order: { id: 505, status: "processing", product: { name: "Audemars Piguet" } },
            attachments: []
          },
          {
            id: 7,
            reporter_id: 501,
            reported_user_id: 202,
            order_id: 506,
            type: "Product Issue",
            description: "The watch stopped working after 2 days. The seller is refusing to provide warranty or refund.",
            status: "Rejected",
            created_at: "2024-01-14T08:10:00Z",
            reporter: { name: "David Lee", email: "david@example.com", type: "user" },
            reported_user: { name: "Jane Smith", email: "jane@example.com", type: "dealer" },
            order: { id: 506, status: "delivered", product: { name: "Breitling Navitimer" } },
            attachments: ["video.mp4", "receipt.jpg"]
          },
          {
            id: 8,
            reporter_id: 202,
            reported_user_id: 501,
            order_id: 507,
            type: "Payment Issue",
            description: "Buyer is claiming payment issue but I have proof of successful payment. This seems like a false report.",
            status: "Pending",
            created_at: "2024-01-13T15:00:00Z",
            reporter: { name: "Jane Smith", email: "jane@example.com", type: "dealer" },
            reported_user: { name: "David Lee", email: "david@example.com", type: "user" },
            order: { id: 507, status: "completed", product: { name: "IWC Portugieser" } },
            attachments: ["payment_proof.pdf"]
          },
          {
            id: 9,
            reporter_id: 601,
            reported_user_id: 203,
            order_id: null,
            type: "Harassment",
            description: "The dealer is sending threatening messages and using abusive language.",
            status: "Under Review",
            created_at: "2024-01-12T12:30:00Z",
            reporter: { name: "Emma Wilson", email: "emma@example.com", type: "user" },
            reported_user: { name: "Alice Johnson", email: "alice@example.com", type: "dealer" },
            order: null,
            attachments: ["screenshots1.png", "screenshots2.png"]
          },
          {
            id: 10,
            reporter_id: 203,
            reported_user_id: 601,
            order_id: 508,
            type: "Fraud",
            description: "Buyer is trying to scam by claiming product not received when tracking shows delivered.",
            status: "Resolved",
            created_at: "2024-01-11T10:15:00Z",
            reporter: { name: "Alice Johnson", email: "alice@example.com", type: "dealer" },
            reported_user: { name: "Emma Wilson", email: "emma@example.com", type: "user" },
            order: { id: 508, status: "delivered", product: { name: "Cartier Santos" } },
            attachments: ["tracking_proof.pdf", "delivery_confirmation.jpg"]
          }
        ];
        this.totalItems = this.allReports.length;
        resolve(null);
      }, 500); // Simulate network delay
    });
  }

  applyFilter(event?: Event) {
    const filterValue = event
      ? (event.target as HTMLInputElement).value.trim().toLowerCase()
      : "";
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onStatusFilterChange() {
    this.applyFilters();
  }

  onTypeFilterChange() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.allReports];

    // Apply status filter
    if (this.statusFilter !== "All") {
      filtered = filtered.filter((report) => report.status === this.statusFilter);
    }

    // Apply type filter
    if (this.typeFilter !== "All") {
      filtered = filtered.filter((report) => report.type === this.typeFilter);
    }

    this.filteredReports = filtered;
    this.dataSource.data = filtered;
    this.totalItems = filtered.length;
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadReports();
  }

  viewDetails(report: any) {
    const dialogRef = this.dialog.open(ReportDetailsComponent, {
      width: "900px",
      maxHeight: "90vh",
      data: { reportId: report.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === "updated") {
        this.loadReports();
      }
    });
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      Pending: "status-pending",
      "Under Review": "status-under-review",
      Resolved: "status-resolved",
      Rejected: "status-rejected",
      "Info Requested": "status-info-requested",
      Suspended: "status-suspended",
      Warned: "status-warned",
    };
    return statusClasses[status] || "status-default";
  }

  getTypeClass(type: string): string {
    const typeClasses: { [key: string]: string } = {
      "Product Issue": "type-product",
      "Payment Issue": "type-payment",
      Fraud: "type-fraud",
      Harassment: "type-harassment",
      Other: "type-other",
    };
    return typeClasses[type] || "type-default";
  }

  formatDate(date: string): string {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

