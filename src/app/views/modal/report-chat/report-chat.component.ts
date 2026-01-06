import { Component, Inject, ElementRef, ViewChild, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: "app-report-chat",
  templateUrl: "./report-chat.component.html",
  styleUrls: ["./report-chat.component.css"],
})
export class ReportChatComponent implements OnInit{
  ngOnInit(): void {
    // If orderId is available, fetch report types from allowed-methods API
    // Otherwise use standard API
    this.getReportTypes();
    
    // If chatId is available, fetch order ID
    if (this.data?.chatId) {
      this.fetchOrderId().then(() => {
        // After fetching order ID, refresh report types if orderId was found
        if (this.reportForm.value.orderId) {
          this.getReportTypes();
        }
      });
    }
  }

  async getReportTypes(): Promise<void> {
    // If orderId is available, use allowed-methods API
    if (this.data?.orderId) {
      try {
        const res: any = await this.http.getAllowedMethods(this.data.orderId).toPromise();
        console.log("Allowed Methods Response:", res);
        
        // Handle response structure: { role: "buyer", allowed_actions: [...] }
        if (res && res.allowed_actions && Array.isArray(res.allowed_actions)) {
          // Use allowed_actions directly as report types
          this.reportTypes = res.allowed_actions;
          console.log("Report Types from allowed_actions:", this.reportTypes);
        }
        // Handle if response has data wrapper
        else if (res && res.data) {
          // Case 1: Response has data.allowed_actions
          if (res.data.allowed_actions && Array.isArray(res.data.allowed_actions)) {
            this.reportTypes = res.data.allowed_actions;
          }
          // Case 2: Response has data as array of methods
          else if (Array.isArray(res.data)) {
            // Extract report types from methods array
            this.reportTypes = res.data
              .filter((method: any) => {
                if (typeof method === 'string') {
                  return method.toLowerCase().includes('report') || 
                         method === 'payment_issue' || 
                         method === 'delivery_delay' ||
                         method === 'payment_delay' ||
                         method === 'fraud' ||
                         method === 'harassment';
                } else if (typeof method === 'object') {
                  const methodName = (method.name || method.method || method.type || '').toLowerCase();
                  return methodName.includes('report') || 
                         methodName.includes('payment') ||
                         methodName.includes('delivery') ||
                         methodName.includes('fraud') ||
                         methodName.includes('harassment');
                }
                return false;
              })
              .map((method: any) => {
                if (typeof method === 'string') {
                  return method;
                } else {
                  return method.name || method.method || method.type || method;
                }
              });
          }
          // Case 3: Response has data.report_types or data.types
          else if (res.data.report_types && Array.isArray(res.data.report_types)) {
            this.reportTypes = res.data.report_types;
          }
          else if (res.data.types && Array.isArray(res.data.types)) {
            this.reportTypes = res.data.types;
          }
          // Case 4: Response has methods object with report types
          else if (res.data.methods && Array.isArray(res.data.methods)) {
            this.reportTypes = res.data.methods
              .filter((method: any) => {
                const methodName = (method.name || method.method || method.type || '').toLowerCase();
                return methodName.includes('report') || 
                       methodName.includes('payment') ||
                       methodName.includes('delivery');
              })
              .map((method: any) => method.name || method.method || method.type);
          }
          // Fallback: Use standard API
          else {
            const typesRes: any = await this.http.getReportTypesAndStatuses().toPromise();
            this.reportTypes = typesRes.data?.types || [];
          }
        } 
        // If response structure is different
        else if (res && Array.isArray(res)) {
          this.reportTypes = res
            .filter((item: any) => {
              const itemName = (typeof item === 'string' ? item : item.name || item.method || '').toLowerCase();
              return itemName.includes('report') || 
                     itemName.includes('payment') ||
                     itemName.includes('delivery');
            })
            .map((item: any) => typeof item === 'string' ? item : item.name || item.method);
        }
        // Fallback to standard API
        else {
          console.log("No allowed_actions found, using standard API");
          const typesRes: any = await this.http.getReportTypesAndStatuses().toPromise();
          this.reportTypes = typesRes.data?.types || [];
        }
      } catch (err) {
        console.error("Error fetching report types from allowed-methods:", err);
        // Fallback to original API
        const typesRes: any = await this.http.getReportTypesAndStatuses().toPromise();
        this.reportTypes = typesRes.data?.types || [];
      }
    } else {
      // Use original API if orderId is not available
      const res: any = await this.http.getReportTypesAndStatuses().toPromise();
      this.reportTypes = res.data?.types || [];
    }
  }

  async fetchOrderId(): Promise<void> {
    try {
      const res: any = await this.http.getOrderByChatId(this.data.chatId).toPromise();
      if (res && res.id) {
        // Store order ID (use res.id as that's the order ID from the API)
        this.orderId = res.id.toString();
        // Also set in form for display
        this.reportForm.patchValue({
          orderId: res.id
        });
        // Update data object so getReportTypes can use it
        if (!this.data.orderId) {
          this.data.orderId = res.id;
        }
      } else if (res && res.id) {
        // Fallback: if order_id is directly available
        this.orderId = res.id;
        this.reportForm.patchValue({
          orderId: res.id
        });
        if (!this.data.orderId) {
          this.data.orderId = res.id;
        }
      }
    } catch (err: any) {
      console.error("Error fetching order ID:", err);
      // Don't show error to user, just log it
      // Order ID is optional, so we can proceed without it
    }
  }

  reportForm: FormGroup;
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  selectedFiles: File[] = [];
  reportTypes: any[] = [];
  orderId: string | null = null;
  // reportTypes = [
  //   { value: "Product Issue", label: "Product Issue" },
  //   { value: "Payment Issue", label: "Payment Issue" },
  //   { value: "Fraud", label: "Fraud" },
  //   { value: "Harassment", label: "Harassment" },
  //   { value: "Other", label: "Other" },
  // ];

  @ViewChild("fileInput") fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private alertService: AlertsServicesService,
    private http: HttpService,
    public translateService: TranslateService,
    public dialogRef: MatDialogRef<ReportChatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.translateService.addLangs(this.supportLanguages);
    this.translateService.setDefaultLang("ar");
    const browserlang = this.translateService.getBrowserLang();
    this.currentLanguage = browserlang;

    if (this.supportLanguages.includes(browserlang)) {
      this.translateService.use(browserlang);
    }

    this.reportForm = this.fb.group({
      reportType: [null, Validators.required],
      orderId: [null],
      reportedUserId: [data?.reportedUserId || null, Validators.required],
      description: ["", [Validators.required, Validators.minLength(10)]],
      attachments: [null],
    });

    // Pre-fill reportedUserId if provided in data
    if (data?.reportedUserId) {
      this.reportForm.patchValue({
        reportedUserId: data.reportedUserId,
      });
    }
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.selectedFiles = Array.from(files);
      this.reportForm.patchValue({
        attachments: this.selectedFiles,
      });
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.reportForm.patchValue({
      attachments: this.selectedFiles.length > 0 ? this.selectedFiles : null,
    });
  }

  uploadFiles(): void {
    this.fileInput.nativeElement.click();
  }

  async onSubmit(): Promise<void> {
    if (this.reportForm.invalid) {
      if (this.translateService.currentLang == "en") {
        this.alertService.showAlert("warning", "Please fill all required fields correctly");
      } else {
        this.alertService.showAlert("warning", "يرجى ملء جميع الحقول المطلوبة بشكل صحيح");
      }
      return;
    }

    const formData = new FormData();
    const reporterId = localStorage.getItem("userID");
    
    formData.append("reported_user_id", this.reportForm.value.reportedUserId);
    formData.append("report_type", this.reportForm.value.reportType);
    formData.append("description", this.reportForm.value.description);

    // Get order_id from form or fetch it if chatId is available
    let orderId = this.reportForm.value.orderId;
    
    // If chatId is available and orderId is not set, try to fetch it
    if (this.data?.chatId && !orderId) {
      try {
        const orderRes: any = await this.http.getOrderByChatId(this.data.chatId).toPromise();
        if (orderRes && orderRes.id) {
          orderId = orderRes.id;
        }
      } catch (err) {
        console.error("Error fetching order ID:", err);
        // Continue without order_id if fetch fails
      }
    }

    // Add order_id to payload if available
    if (orderId) {
      formData.append("order_id", orderId);
    }

    if (this.selectedFiles && this.selectedFiles.length > 0) {
      this.selectedFiles.forEach((file, index) => {
        formData.append(`attachments[]`, file);
      });
    }

    try {
      const res: any = await this.http.submitReport(formData).toPromise();
      
      if (this.translateService.currentLang == "en") {
        this.alertService.showAlert("success", "Report submitted successfully");
      } else {
        this.alertService.showAlert("success", "تم إرسال التقرير بنجاح");
      }
      
      this.dialogRef.close(true);
    } catch (err: any) {
      if (err && err.error) {
        this.alertService.showAlert("warning", `${err.error.message || err.error.error || "Error submitting report"}`);
      } else {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("warning", "Error in submitting report. Please try again");
        } else {
          this.alertService.showAlert("warning", "حدث خطأ أثناء إرسال التقرير، يرجى المحاولة مرة أخرى");
        }
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  formatReportTypeLabel(type: string): string {
    if (!type) return '';
    
    // Format common report types
    const typeMap: any = {
      'payment_issue': 'Payment Issue',
      'payment_delay': 'Payment Delay',
      'delivery_delay': 'Delivery Delay',
      'fraud': 'Fraud',
      'harassment': 'Harassment',
      'product_issue': 'Product Issue',
      'other': 'Other',
      'response_fail': 'Response Fail',
      'cancel_report': 'Cancel Report',
      'issue_resolved': 'Issue Resolved'
    };
    
    // If type exists in map, return formatted label
    if (typeMap[type]) {
      return typeMap[type];
    }
    
    // Otherwise, format by replacing underscores and capitalizing
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
}

