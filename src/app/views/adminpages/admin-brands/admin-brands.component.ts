import { Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { HttpService } from "src/services/http/http.service";
import { AdminBrandsProductComponent } from "../admin-brands-product/admin-brands-product.component";

export interface UserData {
  name: any;
  slug: any;
  description: any;
  cover_image: any;
  meta_title: any;
  meta_description: any;
  meta_keywords: any;
  is_active: any;
  top_brand: any;
}

@Component({
  selector: "app-admin-brands",
  templateUrl: "./admin-brands.component.html",
  styleUrls: ["./admin-brands.component.css"],
})
export class AdminBrandsComponent {
  displayedColumns: string[] = [
    "name",
    "slug",
    "description",
    "cover_image",
    "meta_title",
    "meta_description",
    "meta_keywords",
    "is_active",
    "top_brand",
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
    private http: HttpService,
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

  openModal() {
    const dialogRef = this.dialog.open(AdminBrandsProductComponent, {
      width: '1000px',
      height: 'auto',
      disableClose: true,
      data: { param: 'Create' },
    });
 
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
         this.allUser()
      } 
    });

  }

  allUser() {
    this.http.getAdminBrands().subscribe(
      (res) => {
        this.allData = res.data;

        this.allData = this.allData.map((product: any) => {
          if (product.cover_image) {
            product.cover_image = product.cover_image
              .replace(/\\/g, "/")
              .replace(/^\/+/, "");
          }
          return product;
        });
        this.dataSource = new MatTableDataSource(this.allData);
        this.dataSource.paginator = this.paginator;
      },
      (err) => {}
    );
  }

  isMeOrAdminOrDeveloper(id: any): boolean {
    return true;
  }

  isAdmin(): boolean {
    return true;
  }

  editBrand(data: any) {

    const dialogRef = this.dialog.open(AdminBrandsProductComponent, {
      width: '1000px',
      height: 'auto',
      disableClose: true,
      data: { param: 'Edit',data:data },
    });
 
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
         this.allUser()
      } 
    });
    
  }

  deleteBrand(data) {
    this.http.deleteAdminBrand(data.id).subscribe(
      (res) => {
        this.toast.showAlert("success", "Brand Delete Susseccfully");
        this.allUser();
      },
      (err) => {
        this.toast.showAlert("danger", "Error in removing Barnd");
      }
    );
  }


  activateDeactivateBrand(data) {
    this.http.activateDeactivateAdminBrand(data.id).subscribe(
      (res) => {
        if(res.data.is_active===true){
          this.toast.showAlert("success", "Brand Activate Susseccfully");
        }else{
          this.toast.showAlert("success", "Brand De-activate Susseccfully");
        }
        this.allUser();
      },
      (err) => {
        this.toast.showAlert("danger", "Error in Updating Active Status");
      }
    );
  }


  topBrand(data) {
    this.http.topAdminBrand(data.id).subscribe(
      (res) => {
        if(res.data.top_brand===true){
          this.toast.showAlert("success", "Brand move on top Susseccfully");
        }else{
          this.toast.showAlert("success", "Brand remove from Top");
        }
        this.allUser();
      },
      (err) => {
        this.toast.showAlert("danger", "Error in updating top status");
      }
    );
  }

  deleteUser(data: any) {}

  changingStatus(value: any) {
    if (value == "All") {
      this.currentStatus = "All";
      this.dataSource = new MatTableDataSource(this.allData);
      this.dataSource.paginator = this.paginator;
    } else {
      this.currentStatus = false;
      let newData = this.allData.filter((data: any) => {
        return data.isBlocked == true;
      });
      this.dataSource = new MatTableDataSource(newData);
      this.dataSource.paginator = this.paginator;
    }
  }

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
