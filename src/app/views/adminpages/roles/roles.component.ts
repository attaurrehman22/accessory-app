import {
  Component,
  ViewChild,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { HttpService } from "src/services/http/http.service";
import { SidebarService } from "src/services/sidebar.service";
import { Subscription } from "rxjs";
import { ConfirmationModelComponent } from "../../modal/confirmation-model/confirmation-model.component";
import { PermissionCheckService } from "../../services/permission-check.service";

export interface RoleData {
  id: number;
  name: string;
  permissions: any[];
  created_at: string;
  updated_at: string;
}

@Component({
  selector: "app-roles",
  templateUrl: "./roles.component.html",
  styleUrls: ["./roles.component.css"],
})
export class RolesComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = [
    "id",
    "name",
    "permissions",
    "created_at",
    "updated_at",
    "actions",
  ];
  rolesUpdatePermission = "admin.roles.update";
  rolesDeletePermission = "admin.roles.delete";
  rolesCreatePermission = "admin.roles.create";
  rolesViewPermission = "admin.roles.view";
  dataSource: MatTableDataSource<RoleData>;
  totalRecords: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;
  sidebarClickSubscription: Subscription;
  paginatorSubscription: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private http: HttpService,
    private toast: AlertsServicesService,
    private sidebarService: SidebarService,
    private permissionCheckService: PermissionCheckService
  ) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit(): void {
    this.sidebarClickSubscription = this.sidebarService.sidebarClick$.subscribe(
      () => {
        this.dialog.closeAll();
      }
    );
  }

  doPermissionCheck(permission: string): boolean {
    return this.permissionCheckService.checkPermission(permission);
  }

  ngAfterViewInit() {
    // Set up sorting (client-side on current page data)
    this.dataSource.sort = this.sort;

    // Use setTimeout to ensure view is fully initialized
    setTimeout(() => {
      // Listen to paginator events for server-side pagination
      if (this.paginator) {
        this.paginatorSubscription = this.paginator.page.subscribe(() => {
          this.pageIndex = this.paginator.pageIndex;
          this.pageSize = this.paginator.pageSize;
          this.loadRoles();
        });
      }

      // Load initial data after setting up subscriptions
      this.loadRoles();
    });
  }

  ngOnDestroy() {
    if (this.sidebarClickSubscription) {
      this.sidebarClickSubscription.unsubscribe();
    }
    if (this.paginatorSubscription) {
      this.paginatorSubscription.unsubscribe();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // Apply filter on current page data (client-side)
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  loadRoles() {
    // Server-side pagination: send current page and pageSize to API
    const page = this.pageIndex + 1; // API expects 1-based page numbering
    const perPage = this.pageSize;

    this.http.getAdminRoles(page, perPage).subscribe(
      (res) => {
        // Update table data with current page results
        this.dataSource.data = res.data.data;

        // Update total records count (bound to paginator via HTML [length] binding)
        this.totalRecords = res.data.total || res.data.data.length;
      },
      (error) => {
        this.toast.showAlert("danger", "Failed to load roles");
      }
    );
  }

  isAdmin(): boolean {
    return true;
  }

  createRole() {
    this.router.navigate(["/admin/roles/create"]);
  }

  editRole(data: any) {
    this.router.navigate(["/admin/roles/edit", data.id], { state: { data } });
  }

  deleteRole(data: RoleData) {
    const dialogRef = this.dialog.open(ConfirmationModelComponent, {
      width: "400px",
      data: {
        title: "Delete Role",
        message: `Are you sure you want to delete the role "${data.name}"? This action cannot be undone.`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.http.deleteAdminRole(data.id).subscribe(
          (res) => {
            this.toast.showAlert("success", "Role deleted successfully");
            this.loadRoles();
          },
          (err) => {
            this.toast.showAlert("warning", "Error deleting role");
          }
        );
      }
    });
  }
}
