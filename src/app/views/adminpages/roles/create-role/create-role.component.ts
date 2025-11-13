import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpService } from "src/services/http/http.service";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";

@Component({
  selector: "app-create-role",
  templateUrl: "./create-role.component.html",
  styleUrls: ["./create-role.component.css"],
})
export class CreateRoleComponent implements OnInit {
  roleForm: FormGroup;
  isEditMode: boolean = false;
  roleId: number | null = null;
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  activeSection: string = "";
  roleData: any;
  // Permissions list - customize based on your application
  availablePermissions = [
    // DASHBOARD
    {
      name: "admin.dashboard.view",
      label: "View",
      category: "Dashboard",
    },

    // BRANDS
    {
      name: "admin.brands.view",
      label: "View",
      category: "Brands",
    },
    {
      name: "admin.brands.create",
      label: "Create",
      category: "Brands",
    },
    {
      name: "admin.brands.edit",
      label: "Edit",
      category: "Brands",
    },
    {
      name: "admin.brands.delete",
      label: "Delete",
      category: "Brands",
    },

    // CATEGORY
    {
      name: "admin.categories.view",
      label: "View",
      category: "Category",
    },
    {
      name: "admin.categories.create",
      label: "Create",
      category: "Category",
    },
    {
      name: "admin.categories.edit",
      label: "Edit",
      category: "Category",
    },
    {
      name: "admin.categories.delete",
      label: "Delete",
      category: "Category",
    },

    // PRODUCTS
    {
      name: "admin.products.view",
      label: "View",
      category: "Products",
    },
    {
      name: "admin.products.edit",
      label: "Edit",
      category: "Products",
    },
    {
      name: "admin.products.delete",
      label: "Delete",
      category: "Products",
    },

    // USERS
    {
      name: "admin.users.view",
      label: "View",
      category: "Users",
    },
    {
      name: "admin.users.edit",
      label: "Edit",
      category: "Users",
    },

    // WOTD (Watch of the Day)
    {
      name: "admin.wotd.view",
      label: "View",
      category: "WOTD",
    },
    {
      name: "admin.wotd.create",
      label: "Create",
      category: "WOTD",
    },
    {
      name: "admin.wotd.edit",
      label: "Edit",
      category: "WOTD",
    },
    {
      name: "admin.wotd.delete",
      label: "Delete",
      category: "WOTD",
    },
    {
      name: "admin.wotd.deactivate",
      label: "Deactivate",
      category: "WOTD",
    },

    // VAT
    {
      name: "admin.vat.view",
      label: "View",
      category: "VAT",
    },
    {
      name: "admin.vat.create",
      label: "Create",
      category: "VAT",
    },

    // ORDERS
    {
      name: "admin.orders.view",
      label: "View",
      category: "Orders",
    },
    {
      name: "admin.orders.details.view",
      label: "View Order Details",
      category: "Orders",
    },

    // ROLES
    {
      name: "admin.roles.view",
      label: "View",
      category: "Roles",
    },
    {
      name: "admin.roles.create",
      label: "Create",
      category: "Roles",
    },
    {
      name: "admin.roles.edit",
      label: "Edit",
      category: "Roles",
    },
    {
      name: "admin.roles.delete",
      label: "Delete",
      category: "Roles",
    },
  ];

  permissionsByCategory: any = {};

  // Category icons mapping - FontAwesome classes
  categoryIcons: any = {
    Dashboard: "dashboard",
    Brands: "branding_watermark",
    Category: "category",
    Products: "inventory_2",
    Users: "people",
    WOTD: "watch",
    VAT: "percent",
    Orders: "shopping_cart",
    Roles: "security",
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpService,
    private alertService: AlertsServicesService,
    private cdr: ChangeDetectorRef
  ) {
    this.roleForm = this.fb.group({
      name: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      permissions: [[]],
    });
  }

  ngOnInit(): void {
    // Group permissions by category
    this.groupPermissionsByCategory();

    // Set first category as active by default
    const categories = Object.keys(this.permissionsByCategory);
    if (categories.length > 0) {
      this.activeSection = categories[0];
    }

    // Check if we're in edit mode
    const id = this.route.snapshot.paramMap.get("id");
    if (id && history.state.data) {
      this.roleData = history.state.data;
      this.isEditMode = true;
      this.roleId = +id;
      this.loadRoleData(this.roleData);
    }
  }

  groupPermissionsByCategory(): void {
    this.availablePermissions.forEach((permission) => {
      if (!this.permissionsByCategory[permission.category]) {
        this.permissionsByCategory[permission.category] = [];
      }
      this.permissionsByCategory[permission.category].push(permission);
    });
  }

  loadRoleData(data: any): void {
    this.isLoading = true;

    let permissionNames: string[] = [];

    if (data.permissions && Array.isArray(data.permissions)) {
      permissionNames = data.permissions.map((permission: any) => {
        // If permission is already a string, return it
        if (typeof permission === "string") {
          return permission;
        }
        // If permission is an object, extract the name property
        return permission.name || permission;
      });
    }

    this.roleForm.patchValue({
      name: data.name,
      permissions: permissionNames,
    });
    this.isLoading = false;

    // Manually trigger change detection to update checkboxes
    this.cdr.detectChanges();
  }

  onPermissionChange(permissionName: string, event: any): void {
    const permissions = this.roleForm.get("permissions")?.value || [];
    const isChecked = event.target ? event.target.checked : event.checked;

    if (isChecked) {
      if (!permissions.includes(permissionName)) {
        permissions.push(permissionName);
      }
    } else {
      const index = permissions.indexOf(permissionName);
      if (index > -1) {
        permissions.splice(index, 1);
      }
    }

    this.roleForm.patchValue({ permissions });
  }

  isPermissionChecked(permissionName: string): boolean {
    const permissions = this.roleForm.get("permissions")?.value || [];
    return permissions.includes(permissionName);
  }

  selectAllPermissions(category: string): void {
    const permissions = this.roleForm.get("permissions")?.value || [];
    const categoryPermissions = this.permissionsByCategory[category];

    categoryPermissions.forEach((permission: any) => {
      if (!permissions.includes(permission.name)) {
        permissions.push(permission.name);
      }
    });

    this.roleForm.patchValue({ permissions });
  }

  deselectAllPermissions(category: string): void {
    let permissions = this.roleForm.get("permissions")?.value || [];
    const categoryPermissions = this.permissionsByCategory[category];

    categoryPermissions.forEach((permission: any) => {
      const index = permissions.indexOf(permission.name);
      if (index > -1) {
        permissions.splice(index, 1);
      }
    });

    this.roleForm.patchValue({ permissions });
  }

  getSelectedPermissionsCount(): number {
    const permissions = this.roleForm.get("permissions")?.value || [];
    return permissions.length;
  }

  getCategorySelectedCount(category: string): number {
    const permissions = this.roleForm.get("permissions")?.value || [];
    const categoryPermissions = this.permissionsByCategory[category];

    return categoryPermissions.filter((permission: any) =>
      permissions.includes(permission.name)
    ).length;
  }

  getCategoryIconClass(category: string): string {
    return this.categoryIcons[category] || "folder";
  }

  scrollToSection(category: string): void {
    this.activeSection = category;
    const element = document.getElementById("section-" + category);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  selectAllPermissionsGlobal(): void {
    const allPermissionNames = this.availablePermissions.map((p) => p.name);
    this.roleForm.patchValue({ permissions: allPermissionNames });
  }

  deselectAllPermissionsGlobal(): void {
    this.roleForm.patchValue({ permissions: [] });
  }

  resetForm(): void {
    if (this.isEditMode) {
      this.loadRoleData(this.roleData);
    } else {
      this.roleForm.reset({
        name: "",
        permissions: [],
      });
    }
    this.alertService.showAlert("info", "Form has been reset");
  }

  onSubmit(): void {
    if (this.roleForm.invalid) {
      this.alertService.showAlert(
        "warning",
        "Please fill in all required fields correctly"
      );
      this.markFormGroupTouched(this.roleForm);
      return;
    }

    const selectedPermissions = this.roleForm.get("permissions")?.value || [];
    if (selectedPermissions.length === 0) {
      this.alertService.showAlert(
        "warning",
        "Please select at least one permission for this role"
      );
      return;
    }

    this.isSubmitting = true;
    const formData = this.roleForm.value;

    if (this.isEditMode && this.roleId) {
      // Update existing role
      // Replace with your actual API call
      this.http.updateAdminRole(this.roleId, formData).subscribe(
        (response) => {
          this.alertService.showAlert("success", "Role updated successfully");
          this.router.navigate(["/admin/roles"]);
        },
        (error) => {
          this.alertService.showAlert(
            "danger",
            error?.error?.message || "Failed to update role"
          );
          this.isSubmitting = false;
        }
      );

      // Mock success for now
      setTimeout(() => {
        this.alertService.showAlert("success", "Role updated successfully");
        this.isSubmitting = false;
        this.router.navigate(["/admin/roles"]);
      }, 1000);
    } else {
      // Create new role
      this.http.createAdminRole(formData).subscribe(
        (response) => {
          this.alertService.showAlert("success", "Role created successfully");
          this.router.navigate(["/admin/roles"]);
        },
        (error) => {
          this.alertService.showAlert(
            "danger",
            error?.error?.message || "Failed to create role"
          );
          this.isSubmitting = false;
        }
      );
    }
  }

  onCancel(): void {
    this.router.navigate(["/admin/roles"]);
  }

  // Helper method to mark all fields as touched
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
    return this.roleForm.get("name");
  }
}
