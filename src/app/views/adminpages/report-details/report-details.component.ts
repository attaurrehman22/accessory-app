import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { HttpService } from "src/services/http/http.service";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { TranslateService } from "@ngx-translate/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-report-details",
  templateUrl: "./report-details.component.html",
  styleUrls: ["./report-details.component.css"],
})
export class ReportDetailsComponent implements OnInit {
  report: any = null;
  isLoading = true;
  apiUrl = environment.apipath + "/";
  actionForm: FormGroup;
  showActionForm = false;
  selectedAction: string = "";

  supportLanguages = ["en", "ar", "fr", "ta", "hi"];

  actionTypes = [
    { value: "mark_under_review", label: "Mark as Under Review" },
    { value: "request_info", label: "Request More Info" },
    { value: "warn_user", label: "Warn Reported User" },
    { value: "suspend_user", label: "Suspend User" },
    { value: "reject", label: "Reject Report" },
    { value: "resolve", label: "Resolve Report" },
  ];

  constructor(
    public dialogRef: MatDialogRef<ReportDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpService,
    private alertService: AlertsServicesService,
    public translateService: TranslateService,
    private fb: FormBuilder
  ) {
    this.actionForm = this.fb.group({
      action: ["", Validators.required],
      notes: [""],
    });
  }

  async ngOnInit() {
    await this.loadReportDetails();
  }

  async loadReportDetails() {
    this.isLoading = true;
    try {
      const res: any = await this.http.getAdminReportDetails(this.data.reportId).toPromise();
      
      // Handle API response structure
      if (res.success && res.data) {
        this.report = res.data;
        
        // Map attachments if they are in the new format (array of objects with path and url)
        if (this.report.attachments && Array.isArray(this.report.attachments)) {
          this.report.attachments = this.report.attachments.map((att: any) => {
            // If attachment is an object with url, use url; otherwise use path
            if (typeof att === 'object' && att.url) {
              return att.url;
            } else if (typeof att === 'object' && att.path) {
              return att.path;
            } else if (typeof att === 'string') {
              return att;
            }
            return att;
          });
        }
        
        // Normalize status - handle both "under_review" and "under review" formats
        if (this.report.status) {
          let status = this.report.status.toLowerCase();
          // Replace underscores with spaces
          status = status.replace(/_/g, ' ');
          // Capitalize first letter of each word
          status = status.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
          this.report.status = status;
        }
        // Normalize type - handle both "fraud" and other formats
        if (this.report.type) {
          let type = this.report.type.toLowerCase();
          // Replace underscores with spaces
          type = type.replace(/_/g, ' ');
          // Capitalize first letter of each word
          type = type.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
          this.report.type = type;
        }
      } else if (res.data) {
        // Fallback if response doesn't have success flag
        this.report = res.data;
      } else {
        this.report = res;
      }
      
      this.isLoading = false;
    } catch (err: any) {
      this.isLoading = false;
      if (err && err.error) {
        this.alertService.showAlert("warning", `${err.error.message || "Error loading report details"}`);
      } else {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("warning", "Error loading report details. Please try again");
        } else {
          this.alertService.showAlert("warning", "حدث خطأ أثناء تحميل تفاصيل التقرير، يرجى المحاولة مرة أخرى");
        }
      }
      this.report = null;
    }
  }


  showActionDialog(action: string) {
    this.selectedAction = action;
    this.actionForm.patchValue({ action: action });
    this.showActionForm = true;
  }

  async submitAction() {
    if (this.actionForm.invalid) {
      if (this.translateService.currentLang == "en") {
        this.alertService.showAlert("warning", "Please select an action");
      } else {
        this.alertService.showAlert("warning", "يرجى اختيار إجراء");
      }
      return;
    }

    if (!this.report || !this.report.id) {
      this.alertService.showAlert("warning", "Report ID is missing");
      return;
    }

    // Use action value directly (already in API format)
    const apiAction = this.actionForm.value.action;

    const actionData = {
      action: apiAction,
      notes: this.actionForm.value.notes || "",
      meta: {}
    };

    try {
      const res: any = await this.http.performReportAction(this.report.id, actionData).toPromise();
      
      if (this.translateService.currentLang == "en") {
        this.alertService.showAlert("success", "Action performed successfully");
      } else {
        this.alertService.showAlert("success", "تم تنفيذ الإجراء بنجاح");
      }
      
      this.showActionForm = false;
      this.actionForm.reset();
      this.selectedAction = "";
      
      // Reload report details to get updated status and actions
      await this.loadReportDetails();
      this.dialogRef.close("updated");
    } catch (err: any) {
      if (err && err.error) {
        const errorMessage = err.error.message || err.error.error || "Error performing action";
        this.alertService.showAlert("warning", errorMessage);
      } else {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("warning", "Error performing action. Please try again");
        } else {
          this.alertService.showAlert("warning", "حدث خطأ أثناء تنفيذ الإجراء، يرجى المحاولة مرة أخرى");
        }
      }
    }
  }


  cancelAction() {
    this.showActionForm = false;
    this.actionForm.reset();
    this.selectedAction = "";
  }

  // Helper method to normalize status for comparison
  normalizeStatus(status: string): string {
    if (!status) return "";
    // Convert to lowercase and replace underscores with spaces
    return status.toLowerCase().replace(/_/g, ' ').trim();
  }

  getStatusClass(status: string): string {
    if (!status) return "status-default";
    // Normalize status to handle both "pending" and "Pending"
    const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    const statusClasses: { [key: string]: string } = {
      Pending: "status-pending",
      "Under review": "status-under-review",
      "Under Review": "status-under-review",
      Resolved: "status-resolved",
      Rejected: "status-rejected",
      "Info requested": "status-info-requested",
      "Info Requested": "status-info-requested",
      Suspended: "status-suspended",
      Warned: "status-warned",
    };
    return statusClasses[normalizedStatus] || statusClasses[status] || "status-default";
  }

  getTypeClass(type: string): string {
    if (!type) return "type-default";
    // Normalize type to handle both "fraud" and "Fraud"
    const normalizedType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    const typeClasses: { [key: string]: string } = {
      "Product issue": "type-product",
      "Product Issue": "type-product",
      "Payment issue": "type-payment",
      "Payment Issue": "type-payment",
      Fraud: "type-fraud",
      Harassment: "type-harassment",
      Other: "type-other",
    };
    return typeClasses[normalizedType] || typeClasses[type] || "type-default";
  }

  formatDate(date: string): string {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  getAttachmentUrl(attachment: string): string {
    if (!attachment) return "";
    // If attachment is already a full URL, return it
    if (attachment.startsWith("http://") || attachment.startsWith("https://")) {
      return attachment;
    }
    // Otherwise, prepend API URL
    return this.apiUrl + attachment;
  }

  getAttachmentsList(): any[] {
    if (!this.report || !this.report.attachments) return [];
    
    if (Array.isArray(this.report.attachments)) {
      // Handle both old format (strings) and new format (objects with path/url)
      return this.report.attachments.map((att: any) => {
        if (typeof att === 'object' && att.url) {
          return att.url; // Use URL from API response
        } else if (typeof att === 'object' && att.path) {
          return att.path; // Use path if URL not available
        } else if (typeof att === 'string') {
          return att; // Already a string
        }
        return att;
      });
    }
    
    if (typeof this.report.attachments === "string") {
      try {
        const parsed = JSON.parse(this.report.attachments);
        if (Array.isArray(parsed)) {
          return parsed.map((att: any) => {
            if (typeof att === 'object' && att.url) {
              return att.url;
            } else if (typeof att === 'object' && att.path) {
              return att.path;
            }
            return att;
          });
        }
        return [this.report.attachments];
      } catch {
        return [this.report.attachments];
      }
    }
    
    return [];
  }

  isImage(attachment: string): boolean {
    if (!attachment) return false;
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    const lower = attachment.toLowerCase();
    return imageExtensions.some((ext) => lower.endsWith(ext));
  }

  getFileName(attachment: string): string {
    if (!attachment) return "";
    const parts = attachment.split("/");
    return parts[parts.length - 1];
  }

  openImage(url: string) {
    window.open(url, "_blank");
  }

  hasAttachments(): boolean {
    if (!this.report || !this.report.attachments) return false;
    if (Array.isArray(this.report.attachments)) {
      return this.report.attachments.length > 0;
    }
    if (typeof this.report.attachments === "string") {
      return this.report.attachments.length > 0;
    }
    return false;
  }

  close() {
    this.dialogRef.close();
  }
}

