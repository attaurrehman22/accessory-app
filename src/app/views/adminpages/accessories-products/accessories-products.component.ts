import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { HttpService } from "src/services/http/http.service";
import { SidebarService } from "src/services/sidebar.service";
import { AdminAddProductComponent } from "../admin-add-product/admin-add-product.component";

export interface UserData {
  name: any;
  slug: any;
  brand: any;
  cover_image: any;
  created_by: any;
  price: any;
  model: any;
  is_active: any;
  top_brand: any;
  published_date: any;
}

@Component({
  selector: "app-accessories-products",
  templateUrl: "./accessories-products.component.html",
  styleUrls: ["./accessories-products.component.css"],
})
export class AccessoriesProductsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  displayedColumns: string[] = [
    "name",
    "watch_type",
    "brand",
    "cover_image",
    "created_by",
    "published_date",
    "sale_status",
    "model",
    "is_active",
    "popular_item",
    "action",
  ];
  dataSource = new MatTableDataSource<any>();
  resultsLength = 0;
  pageSize = 5;
  pageEvent: PageEvent;
  selectedValue: string;
  allData: any;
  sidebarClickSubscription: Subscription;

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
    private route: Router,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    this.sidebarClickSubscription = this.sidebarService.sidebarClick$.subscribe(
      () => {
        this.dialog.closeAll();
      }
    );

    // this.getAllCategory();
    // this.getAllBrands();
  }

  category_ids: any[] = [];
  brand_ids: any[] = [];
  watch_gender: any;
  sort_by: any;
  sort_order: any = "desc";
  name: any;

  brandsList: any;
  categoryList: any;

  async getAllCategory() {
    try {
      // Await the promise returned by the HTTP request
      const res = await this.http.getCategoryDropDown().toPromise();
      this.categoryList = res.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  async getAllBrands() {
    try {
      // Wait for the API response
      const res = await this.http.getAllBrandsDropdDown().toPromise();
      this.brandsList = res.data;
    } catch (error) {
      // Log error if something goes wrong with the API request
      console.error("Error fetching brands:", error);
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadData();
  }

  ngOnDestroy() {
    if (this.sidebarClickSubscription) {
      this.sidebarClickSubscription.unsubscribe();
    }
  }

  ClearFilter() {
    this.category_ids = [];
    this.brand_ids = [];
    this.watch_gender = "";
    this.sort_by = "";
    this.sort_order = "desc";
    this.name = "";

    this.loadData();
  }

  async loadData() {
   this.http.getAllAccesriesInformation().subscribe(
      (res) => {
        this.allData = res.data;
        
        this.allData.forEach((item) => {
          if (item.additional_images && Array.isArray(item.additional_images)) {
            // Remove backslashes from each image URL (or string)
            item.additional_images = item.additional_images.map((image) => image.replace(/\\/g, ""));
          }
        });

        this.dataSource = new MatTableDataSource(this.allData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.resultsLength = res.data.length;
      }
    );
  }

  // ✅ Handle Page Change
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageEvent = event;
    this.loadData(); // Reload data on page change
  }

  sortData(sort: Sort) {
    this.loadData();
  }

  openModal() {
    this.router.navigate(["/admin/accessories/add"], {
      state: { param: "Create" },
    });
  }

  isMeOrAdminOrDeveloper(id: any): boolean {
    return true;
  }

  isAdmin(): boolean {
    return true;
  }

  deleteProduct(data) {
    this.http.deleteAdminProducts(data.id).subscribe(
      (res) => {
        this.toast.showAlert("success", "Product Delete Susseccfully");
        this.loadData();
      },
      (err) => {
        this.toast.showAlert("danger", "Error in removing Product");
      }
    );
  }

  activateProduct(data) {
    this.http.activateAdminProducts(data.id).subscribe(
      (res) => {
        if (res.data.is_active === true) {
          this.toast.showAlert("success", "Product add to Susseccfully");
        } else {
          this.toast.showAlert("success", "Product De-activate Susseccfully");
        }
        this.loadData();
      },
      (err) => {
        this.toast.showAlert("danger", "Error in Updating Active Status");
      }
    );
  }

  addPopularProduct(data) {
    this.http.topAdminPopularProducts(data.id).subscribe(
      (res) => {
        this.toast.showAlert("success", "Product move on top Susseccfully");

        this.loadData();
      },
      (err) => {
        this.toast.showAlert("danger", "Error in updating top status");
      }
    );
  }

  addFeatureProduct(data) {
    this.http.topFeatureProducts(data.id).subscribe(
      (res) => {
        this.toast.showAlert("success", "Product Add Features Susseccfully");

        this.loadData();
      },
      (err) => {
        this.toast.showAlert("danger", "Error in Featuring");
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

  editProduct(data) {
    this.router.navigate(["/admin/accessories/add"], {
      state: { param: "Edit", data: data },
    });

    // const dialogRef = this.dialog.open(AdminAddProductComponent, {
    //   width: "1000px",
    //   height: "auto",
    //   data: { param: "Edit", data: data },
    // });

    // dialogRef.afterClosed().subscribe((param) => {
    //   if (param) {
    //     if (param === "approved" || param === "reject") {
    //       this.activateProduct(data);
    //     } else {
    //       this.loadData();
    //     }
    //   }
    // });
  }
}
