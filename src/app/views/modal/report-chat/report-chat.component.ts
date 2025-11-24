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
    this.getReportTypes();
  }

  async getReportTypes(): Promise<void> {
    const res: any = await this.http.getReportTypes().toPromise();
    this.reportTypes = res.data.types;
  }

  reportForm: FormGroup;
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  selectedFiles: File[] = [];
  reportTypes: any[] = [];
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
    
    formData.append("reported_user_id ", reporterId);
    formData.append("reportedUserId", this.reportForm.value.reportedUserId);
    formData.append("report_type", this.reportForm.value.reportType);
    formData.append("description", this.reportForm.value.description);

    if (this.reportForm.value.orderId) {
      formData.append("order_id", this.reportForm.value.orderId);
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
}

