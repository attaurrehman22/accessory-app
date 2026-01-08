import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { HttpService } from 'src/services/http/http.service';
import { LanguageService } from 'src/services/lang-service/language.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModelComponent } from '../../../modal/confirmation-model/confirmation-model.component';

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.css']
})
export class ReportDetailsComponent implements OnInit, OnDestroy {
  apiUrl = environment.apipath + "/";
  reportId: number;
  reportDetails: any = null;
  isLoading: boolean = true;
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  
  // Proof submission
  selectedProofFiles: File[] = [];
  @ViewChild("proofFileInput") proofFileInput!: ElementRef;
  isSubmittingProof: boolean = false;

  // Time remaining
  timeRemaining: any = null;
  countdownInterval: any = null;
  timeRemainingText: string = '';

  // Real-time updates
  pollingInterval: any = null;
  isPolling: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpService,
    private alertService: AlertsServicesService,
    public translateService: TranslateService,
    private languageService: LanguageService,
    private dialog: MatDialog
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
    this.route.params.subscribe(params => {
      this.reportId = +params['id'];
      if (this.reportId) {
        this.loadReportDetails();
        this.startPolling();
      }
    });
  }

  ngOnDestroy(): void {
    this.stopPolling();
    this.stopCountdown();
  }

  async loadReportDetails(): Promise<void> {
    this.isLoading = true;
    try {
      const res: any = await this.http.getUserReportDetails(this.reportId).toPromise();
      this.reportDetails = res.data || res;
      
      // Process attachments if they are JSON strings
      if (this.reportDetails.attachments && typeof this.reportDetails.attachments === 'string') {
        try {
          this.reportDetails.attachments = JSON.parse(this.reportDetails.attachments);
        } catch (error) {
          console.error("Error parsing attachments:", error);
        }
      }

      // Initialize time remaining countdown
      if (this.reportDetails.time_remaining) {
        this.timeRemaining = this.reportDetails.time_remaining;
        this.startCountdown();
      }

      // Process available actions
      if (!this.reportDetails.available_actions) {
        this.reportDetails.available_actions = [];
      }
    } catch (err: any) {
      if (err && err.error) {
        this.alertService.showAlert("warning", `${err.error.message || "Error loading report details"}`);
      } else {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("warning", "Error in loading report details. Please try again");
        } else {
          this.alertService.showAlert("warning", "حدث خطأ أثناء تحميل تفاصيل التقرير، يرجى المحاولة مرة أخرى");
        }
      }
    } finally {
      this.isLoading = false;
    }
  }

  startCountdown(): void {
    this.stopCountdown();
    if (!this.timeRemaining || this.timeRemaining.is_expired) {
      this.timeRemainingText = 'Time expired';
      return;
    }

    this.updateCountdownText();
    this.countdownInterval = setInterval(() => {
      if (this.timeRemaining && !this.timeRemaining.is_expired) {
        this.updateCountdownText();
      } else {
        this.stopCountdown();
        this.timeRemainingText = 'Time expired';
      }
    }, 60000); // Update every minute
  }

  updateCountdownText(): void {
    if (!this.timeRemaining) return;
    
    const hours = this.timeRemaining.hours || 0;
    const minutes = this.timeRemaining.minutes || 0;
    
    if (hours > 0) {
      this.timeRemainingText = `${hours}h ${minutes}m remaining`;
    } else if (minutes > 0) {
      this.timeRemainingText = `${minutes}m remaining`;
    } else {
      this.timeRemainingText = 'Time expired';
    }
  }

  stopCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  startPolling(): void {
    this.stopPolling();
    // Poll every 30 seconds for status updates
    this.pollingInterval = setInterval(() => {
      if (!this.isPolling) {
        this.isPolling = true;
        this.loadReportDetails().finally(() => {
          this.isPolling = false;
        });
      }
    }, 30000);
  }

  stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  formatTypeLabel(type: string): string {
    if (!type) return 'N/A';
    // Use type_label from API if available, otherwise format manually
    return this.reportDetails?.type_label || type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  formatStatusLabel(status: string): string {
    if (!status) return 'N/A';
    // Use status_label from API if available, otherwise format manually
    return this.reportDetails?.status_label || status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  getStatusClass(status: string): string {
    // Updated: Only 3 statuses now - pending, rejected, resolved
    const statusMap: any = {
      'pending': 'status-pending',
      'rejected': 'status-rejected',
      'resolved': 'status-resolved'
    };
    return statusMap[status] || 'status-default';
  }

  formatDate(date: string): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }

  onProofFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.selectedProofFiles = Array.from(files);
    }
  }

  removeProofFile(index: number): void {
    this.selectedProofFiles.splice(index, 1);
  }

  uploadProofFiles(): void {
    this.proofFileInput.nativeElement.click();
  }

  async submitProof(): Promise<void> {
    // Updated: Use new addProof API for pending reports (allows multiple submissions)
    if (!this.reportDetails || this.reportDetails.status !== 'pending') {
      if (this.translateService.currentLang == "en") {
        this.alertService.showAlert("warning", "Proof can only be added to pending reports");
      } else {
        this.alertService.showAlert("warning", "يمكن إضافة الإثبات فقط للتقارير المعلقة");
      }
      return;
    }

    // Notes are optional, but files are required
    if (this.selectedProofFiles.length === 0) {
      if (this.translateService.currentLang == "en") {
        this.alertService.showAlert("warning", "Please select at least one file or add notes");
      } else {
        this.alertService.showAlert("warning", "يرجى اختيار ملف واحد على الأقل أو إضافة ملاحظات");
      }
      return;
    }

    this.isSubmittingProof = true;
    try {
      const formData = new FormData();
      formData.append("report_id", this.reportId.toString());
      
      // Add files if selected
      this.selectedProofFiles.forEach((file) => {
        formData.append("proof_attachments[]", file);
      });

      // Use new addProof API (allows multiple submissions for pending reports)
      const res: any = await this.http.addProof(formData).toPromise();
      
      if (this.translateService.currentLang == "en") {
        this.alertService.showAlert("success", "Proof added successfully");
      } else {
        this.alertService.showAlert("success", "تم إضافة الإثبات بنجاح");
      }
      
      this.selectedProofFiles = [];
      await this.loadReportDetails();
    } catch (err: any) {
      if (err && err.error) {
        this.alertService.showAlert("warning", `${err.error.message || "Error adding proof"}`);
      } else {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("warning", "Error in adding proof. Please try again");
        } else {
          this.alertService.showAlert("warning", "حدث خطأ أثناء إضافة الإثبات، يرجى المحاولة مرة أخرى");
        }
      }
    } finally {
      this.isSubmittingProof = false;
    }
  }

  async cancelReport(): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmationModelComponent, {
      width: "600px",
      data: { 
        message: this.translateService.currentLang == "en" 
          ? "Are you sure you want to cancel this report?" 
          : "هل أنت متأكد أنك تريد إلغاء هذا التقرير؟"
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result == true) {
        try {
          await this.http.cancelReport(this.reportId).toPromise();
          
          if (this.translateService.currentLang == "en") {
            this.alertService.showAlert("success", "Report cancelled successfully");
          } else {
            this.alertService.showAlert("success", "تم إلغاء التقرير بنجاح");
          }
          
          this.router.navigate(['/myprofile/reports']);
        } catch (err: any) {
          if (err && err.error) {
            this.alertService.showAlert("warning", `${err.error.message || "Error cancelling report"}`);
          } else {
            if (this.translateService.currentLang == "en") {
              this.alertService.showAlert("warning", "Error in cancelling report. Please try again");
            } else {
              this.alertService.showAlert("warning", "حدث خطأ أثناء إلغاء التقرير، يرجى المحاولة مرة أخرى");
            }
          }
        }
      }
    });
  }

  async requestManualReview(): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmationModelComponent, {
      width: "600px",
      data: { 
        message: this.translateService.currentLang == "en" 
          ? "Are you sure you want to request manual review for this report?" 
          : "هل أنت متأكد أنك تريد طلب مراجعة يدوية لهذا التقرير؟"
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result == true) {
        try {
          await this.http.requestManualReview(this.reportId).toPromise();
          
          if (this.translateService.currentLang == "en") {
            this.alertService.showAlert("success", "Manual review requested successfully");
          } else {
            this.alertService.showAlert("success", "تم طلب المراجعة اليدوية بنجاح");
          }
          
          await this.loadReportDetails();
        } catch (err: any) {
          if (err && err.error) {
            this.alertService.showAlert("warning", `${err.error.message || "Error requesting manual review"}`);
          } else {
            if (this.translateService.currentLang == "en") {
              this.alertService.showAlert("warning", "Error in requesting manual review. Please try again");
            } else {
              this.alertService.showAlert("warning", "حدث خطأ أثناء طلب المراجعة اليدوية، يرجى المحاولة مرة أخرى");
            }
          }
        }
      }
    });
  }

  async checkResponseTimeout(): Promise<void> {
    try {
      await this.http.checkResponseTimeout(this.reportId).toPromise();
      
      if (this.translateService.currentLang == "en") {
        this.alertService.showAlert("success", "Response timeout checked successfully");
      } else {
        this.alertService.showAlert("success", "تم التحقق من انتهاء وقت الاستجابة بنجاح");
      }
      
      await this.loadReportDetails();
    } catch (err: any) {
      if (err && err.error) {
        this.alertService.showAlert("warning", `${err.error.message || "Error checking response timeout"}`);
      } else {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("warning", "Error in checking response timeout. Please try again");
        } else {
          this.alertService.showAlert("warning", "حدث خطأ أثناء التحقق من انتهاء وقت الاستجابة، يرجى المحاولة مرة أخرى");
        }
      }
    }
  }

  canCancelReport(): boolean {
    if (!this.reportDetails) return false;
    // Check if cancel_report action is available
    return this.reportDetails.available_actions?.some((action: any) => action.action === 'cancel_report') || false;
  }

  canSubmitProof(): boolean {
    if (!this.reportDetails) return false;
    // Updated: Both reporter and reported user can add proof multiple times for pending reports
    return this.reportDetails.status === 'pending';
  }

  canRequestManualReview(): boolean {
    if (!this.reportDetails) return false;
    return this.reportDetails.available_actions?.some((action: any) => action.action === 'manual_review') || false;
  }

  canMarkProofInvalid(): boolean {
    if (!this.reportDetails) return false;
    // Only reporter can mark proof as invalid
    return this.reportDetails.user_role === 'reporter' && 
           this.reportDetails.proof_submissions && 
           this.reportDetails.proof_submissions.length > 0;
  }

  async markProofInvalid(): Promise<void> {
    const reason = prompt(
      this.translateService.currentLang == "en" 
        ? "Please provide a reason for marking this proof as invalid:" 
        : "يرجى تقديم سبب لوضع علامة على هذا الإثبات على أنه غير صالح:"
    );

    if (!reason || reason.trim() === '') {
      if (this.translateService.currentLang == "en") {
        this.alertService.showAlert("warning", "Reason is required");
      } else {
        this.alertService.showAlert("warning", "السبب مطلوب");
      }
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationModelComponent, {
      width: "600px",
      data: { 
        message: this.translateService.currentLang == "en" 
          ? `Are you sure you want to mark this proof as invalid?\nReason: ${reason}` 
          : `هل أنت متأكد أنك تريد وضع علامة على هذا الإثبات على أنه غير صالح؟\nالسبب: ${reason}`
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result == true) {
        try {
          await this.http.markProofInvalid(this.reportId, reason.trim()).toPromise();
          
          if (this.translateService.currentLang == "en") {
            this.alertService.showAlert("success", "Proof has been marked as invalid successfully");
          } else {
            this.alertService.showAlert("success", "تم وضع علامة على الإثبات على أنه غير صالح بنجاح");
          }
          
          await this.loadReportDetails();
        } catch (err: any) {
          if (err && err.error) {
            this.alertService.showAlert("warning", `${err.error.message || "Error marking proof as invalid"}`);
          } else {
            if (this.translateService.currentLang == "en") {
              this.alertService.showAlert("warning", "Error in marking proof as invalid. Please try again");
            } else {
              this.alertService.showAlert("warning", "حدث خطأ أثناء وضع علامة على الإثبات، يرجى المحاولة مرة أخرى");
            }
          }
        }
      }
    });
  }

  async performAction(action: any): Promise<void> {
    switch (action.action) {
      case 'cancel_report':
        await this.cancelReport();
        break;
      case 'submit_proof':
        this.uploadProofFiles();
        break;
      case 'manual_review':
        await this.requestManualReview();
        break;
      case 'mark_proof_invalid':
        await this.markProofInvalid();
        break;
      case 'check_timeout':
        await this.checkResponseTimeout();
        break;
      default:
        console.log('Unknown action:', action);
    }
  }

  getUserMessage(): string {
    if (!this.reportDetails || !this.reportDetails.messages) return '';
    
    if (this.reportDetails.user_role === 'reporter') {
      return this.reportDetails.messages.for_reporter || '';
    } else {
      return this.reportDetails.messages.for_counter_party || '';
    }
  }

  formatDateTime(date: string): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  }

  getActionButtonClass(action: string): string {
    const classMap: any = {
      'cancel_report': 'btn btn-outline-danger',
      'submit_proof': 'btn btn-outline-success',
      'manual_review': 'btn btn-outline-primary',
      'mark_proof_invalid': 'btn btn-outline-warning',
      'check_timeout': 'btn btn-outline-info',
      'view_details': 'btn btn-outline-secondary'
    };
    return classMap[action] || 'btn btn-outline-secondary';
  }

  getActionIcon(action: string): string {
    const iconMap: any = {
      'cancel_report': 'fas fa-times',
      'submit_proof': 'fas fa-upload',
      'manual_review': 'fas fa-user-check',
      'mark_proof_invalid': 'fas fa-times-circle',
      'check_timeout': 'fas fa-clock',
      'view_details': 'fas fa-info-circle'
    };
    return iconMap[action] || 'fas fa-circle';
  }
}
