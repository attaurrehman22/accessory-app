import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { HttpService } from "src/services/http/http.service";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { PermissionCheckService } from "../../services/permission-check.service";
import { ConfirmationModelComponent } from "../../modal/confirmation-model/confirmation-model.component";
import { Subscription } from "rxjs";

export interface VatData {
  id: number;
  percentage: number;
  created_at: string;
  updated_at: string;
  updated_by: string;
  updated_by_name?: string;
}

export interface CurrentVat {
  id: number;
  vat_percentage: number;
  effective_date: string;
  updated_at: string;
  updated_by_name: string;
  updated_by_id: number;
}

@Component({
  selector: "app-admin-vat",
  templateUrl: "./admin-vat.component.html",
  styleUrl: "./admin-vat.component.css",
})
export class AdminVatComponent implements OnInit, OnDestroy {
  vatForm: FormGroup;
  currentVat: CurrentVat | null = null;
  vatHistory: VatData[] = [];
  isLoading: boolean = true;
  isSubmitting: boolean = false;
  isLoadingHistory: boolean = false;
  canUpdate: boolean = false;
  canView: boolean = false;
  displayedColumns: string[] = ["id", "percentage", "updated_by", "created_at"];

  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private alertService: AlertsServicesService,
    private permissionCheckService: PermissionCheckService,
    private dialog: MatDialog
  ) {
    this.vatForm = this.fb.group({
      percentage: [
        "",
        [
          Validators.required,
          Validators.min(0),
          Validators.max(100),
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.checkPermissions();
    if (this.canView) {
      this.loadCurrentVat();
      this.loadVatHistory();
    } else {
      this.isLoading = false;
      this.alertService.showAlert(
        "warning",
        "You do not have permission to view VAT settings"
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  checkPermissions(): void {
    this.canView =
      this.permissionCheckService.checkPermission("admin.vat.view");
    this.canUpdate =
      this.permissionCheckService.checkPermission("admin.vat.update");
  }

  loadCurrentVat(): void {
    this.isLoading = true;
    const sub = this.http.getCurrentVat().subscribe(
      (response) => {
        if (response && response.data) {
          this.currentVat = response.data;
          this.vatForm.patchValue({
            percentage: this.currentVat.vat_percentage,
          });
        }
        this.isLoading = false;
      },
      (error) => {
        console.error("Error loading current VAT:", error);
        this.isLoading = false;
        // Don't show error if VAT hasn't been set yet
        if (error.status !== 404) {
          this.alertService.showAlert(
            "danger",
            error?.error?.message || "Failed to load current VAT"
          );
        }
      }
    );
    this.subscriptions.add(sub);
  }

  loadVatHistory(): void {
    this.isLoadingHistory = true;
    const sub = this.http.getVatHistory().subscribe(
      (response) => {
        if (response && response.data) {
          this.vatHistory = response.data;
        }
        this.isLoadingHistory = false;
      },
      (error) => {
        console.error("Error loading VAT history:", error);
        this.isLoadingHistory = false;
        this.alertService.showAlert(
          "danger",
          error?.error?.message || "Failed to load VAT history"
        );
      }
    );
    this.subscriptions.add(sub);
  }

  onSubmit(): void {
    if (!this.canUpdate) {
      this.alertService.showAlert(
        "warning",
        "You do not have permission to update VAT"
      );
      return;
    }

    if (this.vatForm.invalid) {
      this.alertService.showAlert(
        "warning",
        "Please enter a valid VAT percentage between 0 and 100"
      );
      this.markFormGroupTouched(this.vatForm);
      return;
    }

    const newPercentage = this.vatForm.get("percentage")?.value;

    // Check if value actually changed
    if (this.currentVat && this.currentVat.vat_percentage == newPercentage) {
      this.alertService.showAlert(
        "info",
        "VAT percentage is already set to this value"
      );
      return;
    }

    // Show confirmation dialog
    const dialogRef = this.dialog.open(ConfirmationModelComponent, {
      width: "400px",
      data: {
        title: "Update VAT",
        message: `Are you sure you want to update the VAT percentage to ${newPercentage}%? This will affect all future product listings.`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateVat();
      }
    });
  }

  updateVat(): void {
    this.isSubmitting = true;
    const formData = {
      country_code: "SAU",
      country_name: "Saudi Arabia",
      description: "Standard VAT rate",
      effective_from: new Date().toISOString(),
      is_active: true,
      vat_percentage: this.vatForm.get("percentage")?.value,
    };

    const sub = this.http.updateVat(formData).subscribe(
      (response) => {
        this.alertService.showAlert(
          "success",
          "VAT percentage updated successfully"
        );
        this.isSubmitting = false;
        this.loadCurrentVat();
        this.loadVatHistory();
      },
      (error) => {
        this.alertService.showAlert(
          "danger",
          error?.error?.message || "Failed to update VAT percentage"
        );
        this.isSubmitting = false;
      }
    );
    this.subscriptions.add(sub);
  }

  onReset(): void {
    if (this.currentVat) {
      this.vatForm.patchValue({
        percentage: this.currentVat.vat_percentage,
      });
    } else {
      this.vatForm.reset();
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  get percentage() {
    return this.vatForm.get("percentage");
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString();
  }
}
