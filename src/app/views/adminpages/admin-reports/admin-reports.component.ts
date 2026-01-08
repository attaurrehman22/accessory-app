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
  dateFrom: string = "";
  dateTo: string = "";
  reporterIdFilter: number | null = null;
  reportedUserIdFilter: number | null = null;
  orderIdFilter: number | null = null;

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
      const filters: any = {
        page: this.pageIndex + 1,
        per_page: this.pageSize,
      };

      // Add status filter if not "All"
      if (this.statusFilter && this.statusFilter !== "All") {
        filters.status = this.statusFilter;
      }

      // Add type filter if not "All"
      if (this.typeFilter && this.typeFilter !== "All") {
        filters.type = this.typeFilter;
      }

      // Add date filters if available
      if (this.dateFrom) {
        filters.date_from = this.dateFrom;
      }
      if (this.dateTo) {
        filters.date_to = this.dateTo;
      }

      // Add reporter_id filter if available
      if (this.reporterIdFilter) {
        filters.reporter_id = this.reporterIdFilter;
      }

      // Add reported_user_id filter if available
      if (this.reportedUserIdFilter) {
        filters.reported_user_id = this.reportedUserIdFilter;
      }

      // Add order_id filter if available
      if (this.orderIdFilter) {
        filters.order_id = this.orderIdFilter;
      }

      const res: any = await this.http.getAdminReports(filters).toPromise();
      
      // Handle different response structures
      if (res.data) {
        this.allReports = Array.isArray(res.data) ? res.data : res.data.reports || res.data.data || [];
        this.totalItems = res.data.total || res.data.meta?.total || res.total || this.allReports.length;
      } else if (res.reports) {
        this.allReports = Array.isArray(res.reports) ? res.reports : [];
        this.totalItems = res.total || res.meta?.total || this.allReports.length;
      } else if (Array.isArray(res)) {
        this.allReports = res;
        this.totalItems = res.length;
      } else {
        this.allReports = [];
        this.totalItems = 0;
      }

      this.filteredReports = [...this.allReports];
      this.dataSource.data = this.allReports;
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
      this.allReports = [];
      this.filteredReports = [];
      this.dataSource.data = [];
      this.totalItems = 0;
    } finally {
      this.isLoading = false;
    }
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
    // Reload reports with filters from API
    this.pageIndex = 0; // Reset to first page when filters change
    this.loadReports();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadReports();
  }

  // Method to clear all filters
  clearFilters() {
    this.statusFilter = "All";
    this.typeFilter = "All";
    this.dateFrom = "";
    this.dateTo = "";
    this.reporterIdFilter = null;
    this.reportedUserIdFilter = null;
    this.orderIdFilter = null;
    this.pageIndex = 0;
    this.loadReports();
  }

  viewDetails(report: any) {
    const dialogRef = this.dialog.open(ReportDetailsComponent, {
      width: "1400px",
      maxWidth: "95vw",
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
    // Updated: Only 3 statuses now - pending, rejected, resolved
    const normalizedStatus = status ? status.toLowerCase().trim() : '';
    const statusClasses: { [key: string]: string } = {
      'pending': "status-pending",
      'rejected': "status-rejected",
      'resolved': "status-resolved",
    };
    return statusClasses[normalizedStatus] || "status-default";
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

