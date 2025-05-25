import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpService } from "src/services/http/http.service";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { AddInventoryComponent } from "../add-inventory/add-inventory.component";

export interface CategoryData {
  title: string;
  // accessory_id: number;
  brand: string;
  // sku: string;
  condition: string;
  // condition_note: string;
  // description: string;
  // key_features: string;
  // stock_quantity: number;
  // damaged_quantity: number;
  // user_id: number;
  // purchase_price: number;
  // sale_price: number;
  // offer_price: number;
  // offer_start: string; // ISO date string
  // offer_end: string;   // ISO date string
  // shipping_weight: number;
  // free_shipping: boolean;
  // available_from: string; // ISO date string
  // min_order_quantity: number;
  // slug: string;
  // linked_items: string;
  // meta_title: string;
  // meta_description: string;
  // stuff_pick: boolean;
  active: boolean;
  action:any
}


@Component({
  selector: 'app-inventories',
  templateUrl: './inventories.component.html',
  styleUrls: ['./inventories.component.css']
})
export class InventoriesComponent {

 displayedColumns: string[] = [
  "title",
  // "accessory_id",
  "brand",
  // "sku",
  "condition",
  // "condition_note",
  // "description",
  // "key_features",
  // "stock_quantity",
  // "damaged_quantity",
  // "user_id",
  // "purchase_price",
  // "sale_price",
  // "offer_price",
  // "offer_start",
  // "offer_end",
  // "shipping_weight",
  // "free_shipping",
  // "available_from",
  // "min_order_quantity",
  // "slug",
  // "linked_items",
  // "meta_title",
  // "meta_description",
  // "stuff_pick",
  "active",
  "action"
];

 selectedValue: string;
  dataSource: MatTableDataSource<CategoryData>;
  accessoryCategoryList: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpService, private dialog: MatDialog,private alertService:AlertsServicesService) {}

  ngOnInit(): void {
    this.getAllAccessoryCategories();
  }

  getAllAccessoryCategories() {
    this.http.getInventory().subscribe((res) => {
      this.accessoryCategoryList = res.data;
      this.dataSource = new MatTableDataSource(this.accessoryCategoryList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  openModal() {
    const dialogRef = this.dialog.open(AddInventoryComponent, {
      width: "1000px",
      height: "auto",
      data: { param: "Create" },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == true) {
        this.getAllAccessoryCategories();
      }
    });
  }

  filterCategories() {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  editCategory(data) {
     const dialogRef = this.dialog.open(AddInventoryComponent, {
      width: "1000px",
      height: "auto",
      data: { param: "Edit",data:data },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == true) {
        this.getAllAccessoryCategories();
      }
    });
  }

  deleteCategory(data) {
    this.http.deleteInventory(data.id).subscribe(
      (res)=>{
        this.alertService.showAlert('success','Inventory delete successfully')
        this.getAllAccessoryCategories();
      },(err)=>{
        if(err?.error?.message){
          this.alertService.showAlert('warning',err.error.message)
        }else{
          this.alertService.showAlert('warning','Error in deleting Inventory')
        }
      }
    )
  }
}