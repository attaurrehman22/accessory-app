import { Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { HttpService } from "src/services/http/http.service";

export interface UserData {
  userName: string;
  name: string;
  email: string;
  password: string;
  createdBy: string;
}

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.css']
})
export class AdminCategoryComponent {
  displayedColumns: string[] = [
    "prod_name",
    "brand_name",
    "category",
    "top_category",
    "price",
    "edit",
  ];
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
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private http:HttpService,
    private toast: AlertsServicesService,
    private route: Router
  ) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit(): void {
    this.allUser();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteCategory(data) {
    this.http.deleteAdminCategory(data.id).subscribe(
      (res) => {
        this.toast.showAlert("success", "Category Delete Susseccfully");
        this.allUser();
      },
      (err) => {
        this.toast.showAlert("danger", "Error in removing Category");
      }
    );
  }

  activateDeactivateCategory(data) {
    this.http.activateDeactivateAdminCategory(data.id).subscribe(
      (res) => {
        if(res.data.is_active===true){
          this.toast.showAlert("success", "Category Activate Susseccfully");
        }else{
          this.toast.showAlert("success", "Category De-activate Susseccfully");
        }
        this.allUser();
      },
      (err) => {
        this.toast.showAlert("danger", "Error in Updating Active Status");
      }
    );
  }

  openModal() {
    this.router.navigate(["admin","category","product"], {
      state: { param: "Create" },
    });
  }

  allUser() {
    this.http.getAdminCategory().subscribe(
      (res)=>{
        this.allData=res.data;
        this.dataSource = new MatTableDataSource(this.allData);
        this.dataSource.paginator = this.paginator;
      }
    )

  }

  isMeOrAdminOrDeveloper(id: any): boolean {
    return true;
  }

  isAdmin(): boolean {
    return true;
  }

  editUser(data: any) {
    this.router.navigate(["admin","category","product"], {
      state: { param: "Edit", data: data },
    });
  }

  deleteUser(data: any) {}

  download() {
    const option = {
      filename: `User Data`,
      headers: ["User Name", "Name", "Email Address", "Blocked"],
    };

    let newData = [];

    if (this.currentStatus == "All") {
      this.dataSource.filteredData.map((item: any, i: any) => {
        newData[i] = {
          userName: item.userName,
          name: item.name,
          email: item.email,
          status: item.isBlocked,
        };
      });
    } else {
      this.dataSource.filteredData.map((item: any, i: any) => {
        if (item.isBlocked == true) {
          newData.push({
            userName: item.userName,
            name: item.name,
            email: item.email,
            status: item.isBlocked,
          });
        }
      });
    }
  }
}
