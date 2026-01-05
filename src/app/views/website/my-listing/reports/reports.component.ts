import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { HttpService } from 'src/services/http/http.service';
import { LanguageService } from 'src/services/lang-service/language.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, OnDestroy {
  apiUrl = environment.apipath + "/";
  reports: any[] = [];
  isLoading: boolean = true;
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;

  // Filters
  statusFilter: string = "All";
  typeFilter: string = "All";
  dateFrom: string = "";
  dateTo: string = "";
  orderIdFilter: number | null = null;

  // Pagination
  pageIndex: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;

  // Options
  statusOptions: any[] = [];
  typeOptions: any[] = [];

  constructor(
    private http: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertsServicesService,
    public translateService: TranslateService,
    private languageService: LanguageService
  ) {
    this.translateService.addLangs(this.supportLanguages);
    const savedLang = this.languageService.getCurrentLanguage();
    if (this.supportLanguages.includes(savedLang)) {
      this.translateService.use(savedLang);
    } else {
      const browserLang = this.translateService.getBrowserLang();
      this.currentLanguage = browserLang;
      if (this.supportLanguages.includes(browserLang)) {
        this.translateService.use(browserLang);
        this.languageService.setLanguage(browserLang);
      }
    }
  }

  ngOnInit(): void {
    this.loadReportTypes();
    this.loadReports();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  async loadReportTypes(): Promise<void> {
    try {
      const res: any = await this.http.getReportTypesAndStatuses().toPromise();
      if (res.success && res.data) {
        // Map types
        this.typeOptions = [
          { value: "All", label: "All Types" },
          ...res.data.types.map((type: string) => ({
            value: type,
            label: this.formatTypeLabel(type)
          }))
        ];

        // Map statuses
        this.statusOptions = [
          { value: "All", label: "All Status" },
          ...res.data.statuses.map((status: string) => ({
            value: status,
            label: this.formatStatusLabel(status)
          }))
        ];
      }
    } catch (err) {
      console.error("Error loading report types:", err);
    }
  }

  formatTypeLabel(type: string): string {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  formatStatusLabel(status: string): string {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  async loadReports(): Promise<void> {
    this.isLoading = true;
    try {
      const filters: any = {
        page: this.pageIndex + 1,
        per_page: this.pageSize,
      };

      if (this.statusFilter && this.statusFilter !== "All") {
        filters.status = this.statusFilter;
      }

      if (this.typeFilter && this.typeFilter !== "All") {
        filters.type = this.typeFilter;
      }

      if (this.dateFrom) {
        filters.date_from = this.dateFrom;
      }

      if (this.dateTo) {
        filters.date_to = this.dateTo;
      }

      if (this.orderIdFilter) {
        filters.order_id = this.orderIdFilter;
      }

      const res: any = await this.http.getUserReports(filters).toPromise();
      
      if (res.data) {
        this.reports = Array.isArray(res.data) ? res.data : res.data.reports || res.data.data || [];
        this.totalItems = res.data.total || res.data.meta?.total || res.total || this.reports.length;
      } else if (res.reports) {
        this.reports = Array.isArray(res.reports) ? res.reports : [];
        this.totalItems = res.total || res.meta?.total || this.reports.length;
      } else if (Array.isArray(res)) {
        this.reports = res;
        this.totalItems = res.length;
      } else {
        this.reports = [];
        this.totalItems = 0;
      }
    } catch (err: any) {
      if (err && err.error) {
        this.alertService.showAlert("warning", `${err.error.message || "Error loading reports"}`);
      } else {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("warning", "Error in loading reports. Please try again");
        } else {
          this.alertService.showAlert("warning", "حدث خطأ أثناء تحميل التقارير، يرجى المحاولة مرة أخرى");
        }
      }
      this.reports = [];
      this.totalItems = 0;
    } finally {
      this.isLoading = false;
    }
  }

  onStatusFilterChange(): void {
    this.pageIndex = 0;
    this.loadReports();
  }

  onTypeFilterChange(): void {
    this.pageIndex = 0;
    this.loadReports();
  }

  onDateFilterChange(): void {
    this.pageIndex = 0;
    this.loadReports();
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadReports();
  }

  viewReportDetails(report: any): void {
    this.router.navigate(['/myprofile/reports', report.id]);
  }

  getStatusClass(status: string): string {
    const statusMap: any = {
      'pending': 'status-pending',
      'under_review': 'status-review',
      'info_requested': 'status-info',
      'warned': 'status-warned',
      'suspended': 'status-suspended',
      'rejected': 'status-rejected',
      'resolved': 'status-resolved'
    };
    return statusMap[status] || 'status-default';
  }

  formatDate(date: string): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }
}
