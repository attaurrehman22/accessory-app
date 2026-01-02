import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpService } from "src/services/http/http.service";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { tap, catchError } from "rxjs/operators";
import { Observable, of } from "rxjs";

@Component({
  selector: "app-create-user",
  templateUrl: "./create-user.component.html",
  styleUrls: ["./create-user.component.css"],
})
export class CreateUserComponent implements OnInit {
  userForm: FormGroup;
  isEditMode: boolean = false;
  isSubmitting: boolean = false;
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
  availableRoles: any[] = [];
  isLoadingRoles: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpService,
    private alertService: AlertsServicesService
  ) {
    this.userForm = this.fb.group(
      {
        name: [
          "",
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ],
        ],
        email: [
          "",
          [Validators.required, Validators.email, Validators.maxLength(255)],
        ],
        password: [
          "",
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(255),
          ],
        ],
        confirmPassword: ["", [Validators.required]],
        roles: [[], [Validators.required]],
        user_type: ["chronosouq-user"],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    if (this.data && this.data.user) {
      this.isEditMode = true;
      this.loadRoles().subscribe(() => {
        this.loadUserData(this.data.user);
      });
      // Remove password validators for edit mode
      this.userForm.get("password")?.clearValidators();
      this.userForm.get("confirmPassword")?.clearValidators();
      this.userForm.get("password")?.updateValueAndValidity();
      this.userForm.get("confirmPassword")?.updateValueAndValidity();
    } else {
      this.loadRoles().subscribe();
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get("password");
    const confirmPassword = control.get("confirmPassword");

    if (!password || !confirmPassword) {
      return null;
    }

    if (confirmPassword.value === "") {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      const errors = confirmPassword.errors;
      if (errors) {
        delete errors["passwordMismatch"];
        if (Object.keys(errors).length === 0) {
          confirmPassword.setErrors(null);
        }
      }
      return null;
    }
  }

  loadRoles(): Observable<any> {
    this.isLoadingRoles = true;
    return this.http.getAdminRoles(1, 100).pipe(
      tap((res) => {
        this.availableRoles = res.data.data || [];
        this.isLoadingRoles = false;
      }),
      catchError((error) => {
        this.alertService.showAlert("warning", "Failed to load roles");
        this.isLoadingRoles = false;
        return of({ data: { data: [] } }); // Return empty array on error
      })
    );
  }

  loadUserData(user: any): void {
    this.http.getChronosouqUserDetails(user.id).subscribe(
      (res) => {
        // roles is already an array of role names (strings), use them directly
        const roleNames = res.data.roles || [];

        this.userForm.patchValue({
          name: res.data.name,
          email: res.data.email,
          roles: roleNames, // Use role names directly
          type: res.data.type || "chronosouq-user",
        });
      },
      (error) => {
        this.alertService.showAlert("warning", "Failed to load user details");
      }
    );
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.alertService.showAlert(
        "warning",
        "Please fill in all required fields correctly"
      );
      this.markFormGroupTouched(this.userForm);
      return;
    }

    this.isSubmitting = true;
    const formData = { ...this.userForm.value };

    // Remove confirmPassword from the data sent to API
    // In edit mode, remove confirmPassword control before sending to API
    if (this.isEditMode) {
      delete formData.confirmPassword;
    } else {
      if (formData.confirmPassword) {
        formData.password_confirmation = formData.confirmPassword;
        delete formData.confirmPassword;
      }
    }

    // If edit mode and password is empty, remove password field
    if (this.isEditMode && !formData.password) {
      delete formData.password;
    }

    if (this.isEditMode) {
      // Update existing user
      this.http.updateChronosouqUser(this.data.user.id, formData).subscribe(
        (response) => {
          this.alertService.showAlert("success", "User updated successfully");
          this.dialogRef.close(true);
        },
        (error) => {
          this.alertService.showAlert(
            "danger",
            error?.error?.message || "Failed to update user"
          );
          this.isSubmitting = false;
        }
      );
    } else {
      // Create new user
      this.http.createChronosouqUser(formData).subscribe(
        (response) => {
          this.alertService.showAlert("success", "User created successfully");
          this.dialogRef.close(true);
        },
        (error) => {
          if (error.error.error.email) {
            this.alertService.showAlert("danger", error.error.error.email[0]);
            this.isSubmitting = false;
            return;
          }
          this.alertService.showAlert(
            "danger",
            error?.error?.message || "Failed to create user"
          );
          this.isSubmitting = false;
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
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

  // Getter methods for template
  get name() {
    return this.userForm.get("name");
  }

  get email() {
    return this.userForm.get("email");
  }

  get password() {
    return this.userForm.get("password");
  }

  get confirmPassword() {
    return this.userForm.get("confirmPassword");
  }

  get roles() {
    return this.userForm.get("roles");
  }
}
