import { Component, ViewChild, OnInit, OnDestroy } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { HttpService } from "src/services/http/http.service";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { Subscription } from "rxjs";
import { SidebarService } from "src/services/sidebar.service";
import { PermissionCheckService } from "../../services/permission-check.service";

export interface UserData {
  userName: string;
  name: string;
  email: string;
  password: string;
  createdBy: string;
}

@Component({
  selector: "app-admin-users",
  templateUrl: "./admin-users.component.html",
  styleUrls: ["./admin-users.component.css"],
})
export class AdminUsersComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    "name",
    "email",
    "country",
    "city",
    "type",
    "edit",
  ];
  usersUpdatePermission = "admin.users.update";
  usersDeletePermission = "admin.users.delete";
  usersCreatePermission = "admin.users.create";
  usersViewPermission = "admin.users.view";
  dataSource: MatTableDataSource<UserData>;
  selectedValue: string;
  allData: any;

  userStatu: any = [
    { value: "All", viewValue: "All" },
    { value: false, viewValue: "Blocked user" },
  ];

  currentStatus: any = "All";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  sidebarClickSubscription: Subscription;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private http: HttpService,
    private toast: AlertsServicesService,
    private alertService: AlertsServicesService,
    private sidebarService: SidebarService,
    private permissionCheckService: PermissionCheckService,
  ) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit(): void {
    this.allUser();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.sidebarClickSubscription = this.sidebarService.sidebarClick$.subscribe(
      () => {
        this.dialog.closeAll();
      },
    );
  }

  doPermissionCheck(permission: string): boolean {
    return this.permissionCheckService.checkPermission(permission);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  changeUserType(data) {
    const formData = {
      user_id: data.id,
      type: data.type === "dealer" ? "user" : "dealer",
    };
    this.http.changeUserType(formData).subscribe(
      (res) => {
        this.alertService.showAlert("success", "User Typr Update Susseccfully");
        this.allUser();
      },
      (err) => {
        this.alertService.showAlert("warning", "Error in Updating User Type");
      },
    );
  }

  allUser() {
    this.http.getAdminUsers().subscribe(
      (res) => {
        // Filter out users with type 'admin'
        this.allData = res.data.filter(
          (user: any) => user.type !== "chronosouq-user",
        );

        // Set the filtered data to the data source
        this.dataSource = new MatTableDataSource(this.allData);
        this.dataSource.paginator = this.paginator;
      },
      (err) => {
        // Handle error if needed
        console.error(err);
      },
    );
  }

  isMeOrAdminOrDeveloper(id: any): boolean {
    return true;
  }

  isAdmin(): boolean {
    return true;
  }

  deleteUser(data: any) {}
}
