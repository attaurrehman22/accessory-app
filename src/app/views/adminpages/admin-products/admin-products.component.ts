import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from "@angular/router";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { HttpService } from "src/services/http/http.service";
import { AdminAddProductComponent } from "../admin-add-product/admin-add-product.component";
import { Subscription } from 'rxjs';
import { SidebarService } from 'src/services/sidebar.service';

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
  selector: "app-admin-products",
  templateUrl: "./admin-products.component.html",
  styleUrls: ["./admin-products.component.css"],
})
export class AdminProductsComponent implements OnInit, AfterViewInit, OnDestroy {
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
    private sidebarService: SidebarService,
  ) {}

  ngOnInit(): void {
    this.sidebarClickSubscription = this.sidebarService.sidebarClick$.subscribe(() => {
      this.dialog.closeAll();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadData(); // Moved loadData here
  }

  ngOnDestroy() {
    if (this.sidebarClickSubscription) {
      this.sidebarClickSubscription.unsubscribe();
    }
  }

  loadData() {
    const pageIndex = this.pageEvent ? this.pageEvent.pageIndex : 0;
    const pageSize = this.pageEvent ? this.pageEvent.pageSize : this.pageSize;
    const sortField = this.sort.active;
    const sortDirection = this.sort.direction;

    this.http.getAdminProducts(pageIndex, pageSize, sortField, sortDirection).subscribe(data => {
      this.dataSource.data = data.data.data.map((product: any) => {
        this.allData = data.data.data;

        this.allData = this.allData.map((product: any) => {
          if (product.main_image) {
            product.main_image = product.main_image
              .replace(/\\/g, "/")
              .replace(/^\/+/, "");
            return product;
          }
        });
        this.dataSource = new MatTableDataSource(this.allData);
        this.dataSource.paginator = this.paginator;
      });
      this.resultsLength = data.data.total;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    // Custom filter to check every field
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      // You can specify which fields you want to filter on here
      return (
        data.name.toLowerCase().includes(filter) ||
        data.watch_type.toLowerCase().includes(filter) ||
        (data.brand && data.brand.name.toLowerCase().includes(filter)) ||
        (data.created_by && data.created_by.name.toLowerCase().includes(filter)) ||
        (data.price && data.price.toString().includes(filter)) ||
        (data.model && data.model.toLowerCase().includes(filter)) ||
        (data.is_active && data.is_active.toString().includes(filter)) ||
        (data.top_brand && data.top_brand.toString().includes(filter)) ||
        (data.categories && data.categories.some((category: any) => category.name.toLowerCase().includes(filter))) || // Categories
        (data.description && data.description.toLowerCase().includes(filter)) // Description
      );
    };

    // Apply the filter to the dataSource
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  sortData(sort: Sort) {
    this.loadData();
  }

  openModal() {
    this.router.navigate(["/admin-brands-product"], {
      state: { param: "Create" },
    });
  }

  // loadData() {
  //   this.http.getAdminProducts().subscribe(
  //     (res) => {
  //       this.allData = res.data.data;

  //       this.allData = this.allData.map((product: any) => {
  //         if (product.main_image) {
  //           product.main_image = product.main_image
  //             .replace(/\\/g, "/")
  //             .replace(/^\/+/, "");
  //         }
  //         return product;
  //       });
  //       this.dataSource = new MatTableDataSource(this.allData);
  //       this.dataSource.paginator = this.paginator;
  //     },
  //     (err) => {}
  //   );
  // }

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

  deleteUser(data: any) { }

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
    const dialogRef = this.dialog.open(AdminAddProductComponent, {
      width: '1000px',
      height: 'auto',
      disableClose: true,
      data: { param: 'Edit', data: data },
    });

    dialogRef.afterClosed().subscribe((param) => {
      if (param) {
        if (param === 'approved' || param === 'reject') {
          this.activateProduct(data)
        } else {
          this.loadData()
        }
      }
    });
  }
}
