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
  allData: any[] = [];
  sidebarClickSubscription: Subscription;

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
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadUsers();
  }

  ngOnDestroy() {
    if (this.sidebarClickSubscription) {
      this.sidebarClickSubscription.unsubscribe();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getPaginatedData(): UserData[] {
    if (!this.paginator) {
      return this.dataSource.filteredData;
    }
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    return this.dataSource.filteredData.slice(startIndex, endIndex);
  }

  loadUsers() {
    this.http
      .getChronosouqUsers(this.paginator.pageIndex + 1, this.paginator.pageSize)
      .subscribe(
        (res) => {
          this.allData = res.data;
          this.dataSource = new MatTableDataSource(this.allData);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
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
