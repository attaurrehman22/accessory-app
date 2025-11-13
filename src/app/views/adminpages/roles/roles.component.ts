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
  dataSource: MatTableDataSource<RoleData>;
  allData: any[] = [];
  sidebarClickSubscription: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
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
    this.loadRoles();
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

  getPaginatedData(): RoleData[] {
    if (!this.paginator) {
      return this.dataSource.filteredData;
    }
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    return this.dataSource.filteredData.slice(startIndex, endIndex);
  }

  loadRoles() {
    this.http
      .getAdminRoles(this.paginator.pageIndex + 1, this.paginator.pageSize)
      .subscribe(
        (res) => {
          this.allData = res.data.data;
          this.dataSource = new MatTableDataSource(this.allData);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
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
