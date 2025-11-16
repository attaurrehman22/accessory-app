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
    { value: "under_review", label: "Mark as Under Review" },
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
      // TODO: Replace with actual API call when backend is ready
      // const res: any = await this.http.getAdminReportDetails(this.data.reportId).toPromise();
      // this.report = res.report || res.data;
      
      // Dummy data for testing
      await this.loadDummyReportDetails();
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
    }
  }

  loadDummyReportDetails() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Get dummy report based on ID
        const dummyReports: any = {
          1: {
            id: 1,
            reporter_id: 101,
            reported_user_id: 202,
            order_id: 501,
            type: "Fraud",
            description: "Seller took payment but never shipped the watch. I paid on 15th January but haven't received any update or product. The seller is not responding to my messages and has blocked me.",
            status: "Pending",
            created_at: "2024-01-20T10:30:00Z",
            updated_at: "2024-01-20T10:30:00Z",
            reporter: { name: "John Doe", email: "john@example.com", type: "user", id: 101 },
            reported_user: { name: "Jane Smith", email: "jane@example.com", type: "dealer", id: 202 },
            order: { id: 501, status: "pending", product: { name: "Rolex Submariner", price: 8500 } },
            attachments: ["proof1.png", "proof2.jpg"],
            actions: []
          },
          2: {
            id: 2,
            reporter_id: 203,
            reported_user_id: 101,
            order_id: 502,
            type: "Product Issue",
            description: "The watch received is different from what was described. The condition is poor and doesn't match the photos. There are scratches that were not mentioned in the listing.",
            status: "Under Review",
            created_at: "2024-01-19T14:20:00Z",
            updated_at: "2024-01-19T15:30:00Z",
            reporter: { name: "Alice Johnson", email: "alice@example.com", type: "user", id: 203 },
            reported_user: { name: "John Doe", email: "john@example.com", type: "dealer", id: 101 },
            order: { id: 502, status: "delivered", product: { name: "Omega Speedmaster", price: 4200 } },
            attachments: ["comparison.jpg"],
            actions: [
              {
                id: 1,
                action: "under_review",
                notes: "Reviewing product images and comparing with listing description",
                admin_id: 1,
                admin: { name: "Admin User", id: 1 },
                created_at: "2024-01-19T15:30:00Z"
              }
            ]
          },
          3: {
            id: 3,
            reporter_id: 202,
            reported_user_id: 301,
            order_id: null,
            type: "Harassment",
            description: "The buyer is sending inappropriate messages and threatening me. Please take action immediately.",
            status: "Resolved",
            created_at: "2024-01-18T09:15:00Z",
            updated_at: "2024-01-18T16:00:00Z",
            reporter: { name: "Jane Smith", email: "jane@example.com", type: "dealer", id: 202 },
            reported_user: { name: "Bob Williams", email: "bob@example.com", type: "user", id: 301 },
            order: null,
            attachments: ["messages.png"],
            actions: [
              {
                id: 2,
                action: "warn_user",
                notes: "User warned about inappropriate behavior",
                admin_id: 1,
                admin: { name: "Admin User", id: 1 },
                created_at: "2024-01-18T10:00:00Z"
              },
              {
                id: 3,
                action: "resolve",
                notes: "Issue resolved after warning the user",
                admin_id: 1,
                admin: { name: "Admin User", id: 1 },
                created_at: "2024-01-18T16:00:00Z"
              }
            ]
          }
        };

        this.report = dummyReports[this.data.reportId] || dummyReports[1];
        resolve(null);
      }, 300);
    });
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

    const formData = {
      report_id: this.report.id,
      action: this.actionForm.value.action,
      notes: this.actionForm.value.notes || "",
    };

    try {
      // TODO: Replace with actual API call when backend is ready
      // const res: any = await this.http.performReportAction(formData).toPromise();
      
      // Simulate API call with dummy data
      await this.simulateAction(formData);
      
      if (this.translateService.currentLang == "en") {
        this.alertService.showAlert("success", "Action performed successfully");
      } else {
        this.alertService.showAlert("success", "تم تنفيذ الإجراء بنجاح");
      }
      
      this.showActionForm = false;
      this.actionForm.reset();
      await this.loadReportDetails();
      this.dialogRef.close("updated");
    } catch (err: any) {
      if (err && err.error) {
        this.alertService.showAlert("warning", `${err.error.message || "Error performing action"}`);
      } else {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("warning", "Error performing action. Please try again");
        } else {
          this.alertService.showAlert("warning", "حدث خطأ أثناء تنفيذ الإجراء، يرجى المحاولة مرة أخرى");
        }
      }
    }
  }

  simulateAction(formData: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Update report status based on action
        const statusMap: any = {
          "under_review": "Under Review",
          "request_info": "Info Requested",
          "warn_user": "Warned",
          "suspend_user": "Suspended",
          "reject": "Rejected",
          "resolve": "Resolved"
        };

        if (this.report) {
          this.report.status = statusMap[formData.action] || this.report.status;
          
          // Add action to history
          if (!this.report.actions) {
            this.report.actions = [];
          }
          
          this.report.actions.push({
            id: this.report.actions.length + 1,
            action: formData.action,
            notes: formData.notes,
            admin_id: 1,
            admin: { name: "Admin User", id: 1 },
            created_at: new Date().toISOString()
          });
        }
        
        resolve(null);
      }, 500);
    });
  }

  cancelAction() {
    this.showActionForm = false;
    this.actionForm.reset();
    this.selectedAction = "";
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
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  getAttachmentUrl(attachment: string): string {
    if (!attachment) return "";
    if (attachment.startsWith("http")) return attachment;
    return this.apiUrl + attachment;
  }

  getAttachmentsList(): string[] {
    if (!this.report.attachments) return [];
    if (Array.isArray(this.report.attachments)) {
      return this.report.attachments;
    }
    if (typeof this.report.attachments === "string") {
      try {
        const parsed = JSON.parse(this.report.attachments);
        return Array.isArray(parsed) ? parsed : [this.report.attachments];
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

