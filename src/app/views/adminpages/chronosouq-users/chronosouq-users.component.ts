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
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { HttpService } from "src/services/http/http.service";
import { SidebarService } from "src/services/sidebar.service";
import { Subscription } from "rxjs";
import { ConfirmationModelComponent } from "../../modal/confirmation-model/confirmation-model.component";
import { CreateUserComponent } from "./create-user/create-user.component";

export interface UserData {
  id: number;
  name: string;
  email: string;
  type: string;
  roles: any[];
  created_at: string;
  updated_at: string;
}

@Component({
  selector: "app-chronosouq-users",
  templateUrl: "./chronosouq-users.component.html",
  styleUrl: "./chronosouq-users.component.css",
})
export class ChronosouqUsersComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  displayedColumns: string[] = [
    "id",
    "name",
    "email",
    "roles",
    "created_at",
    "updated_at",
    "actions",
  ];
  dataSource: MatTableDataSource<UserData>;
  totalRecords: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;
  sidebarClickSubscription: Subscription;
  paginatorSubscription: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private http: HttpService,
    private toast: AlertsServicesService,
    private sidebarService: SidebarService
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
          this.loadUsers();
        });
      }

      // Load initial data after setting up subscriptions
      this.loadUsers();
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

  loadUsers() {
    // Server-side pagination: send current page and pageSize to API
    const page = this.pageIndex + 1; // API expects 1-based page numbering
    const perPage = this.pageSize;

    this.http.getChronosouqUsers(page, perPage).subscribe(
      (res) => {
        // Update table data with current page results
        this.dataSource.data = res.data.data || res.data;

        // Update total records count (bound to paginator via HTML [length] binding)
        this.totalRecords =
          res.meta.total ||
          (res.data.data ? res.data.data.length : res.data.length);
      },
      (error) => {
        this.toast.showAlert("danger", "Failed to load users");
      }
    );
  }

  isAdmin(): boolean {
    return true;
  }

  createUser() {
    const dialogRef = this.dialog.open(CreateUserComponent, {
      width: "600px",
      disableClose: true,
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  editUser(data: any) {
    const dialogRef = this.dialog.open(CreateUserComponent, {
      width: "600px",
      disableClose: true,
      data: { user: data },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  deleteUser(data: UserData) {
    const dialogRef = this.dialog.open(ConfirmationModelComponent, {
      width: "400px",
      data: {
        title: "Delete User",
        message: `Are you sure you want to delete the user "${data.name}"? This action cannot be undone.`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.http.deleteChronosouqUser(data.id).subscribe(
          (res) => {
            this.toast.showAlert("success", "User deleted successfully");
            this.loadUsers();
          },
          (err) => {
            this.toast.showAlert("warning", "Error deleting user");
          }
        );
      }
    });
  }

  getRoleNames(roles: any[]): string {
    if (!roles || roles.length === 0) {
      return "No roles assigned";
    }
    return roles.map((role) => role.name).join(", ");
  }
}
