import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpService } from "src/services/http/http.service";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { AddAttributeValuesComponent } from "../add-attribute-values/add-attribute-values.component";

export interface AttributeData {
  // attribute_id: any;
  // shop_id: any;
  value: any;
  color: any;
  order: any;
  action:any;
}

@Component({
  selector: 'app-attribute-values',
  templateUrl: './attribute-values.component.html',
  styleUrls: ['./attribute-values.component.css']
})
export class AttributeValuesComponent implements OnInit {

  displayedColumns: string[] = [
    // "attribute_id",
    // "shop_id",
    "value",
    "color",
    "order",
    "action",
  ];

  selectedValue: string;
  dataSource: MatTableDataSource<AttributeData>;
  accessoryCategoryList: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpService, private dialog: MatDialog,private alertService:AlertsServicesService) {}

  ngOnInit(): void {
    this.getAllAccessoryCategories();
  }

  getAllAccessoryCategories() {
    this.http.getAttributesValue().subscribe((res) => {
      this.accessoryCategoryList = res;
      this.dataSource = new MatTableDataSource(this.accessoryCategoryList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  openModal() {
    const dialogRef = this.dialog.open(AddAttributeValuesComponent, {
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
      const dialogRef = this.dialog.open(AddAttributeValuesComponent, {
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
    this.http.deleteAttributesValue(data.id).subscribe(
      (res)=>{
        this.alertService.showAlert('success','Attribute Value delete successfully')
        this.getAllAccessoryCategories();
      },(err)=>{
        if(err?.error?.message){
          this.alertService.showAlert('warning',err.error.message)
        }else{
          this.alertService.showAlert('warning','Error in deleting Attribute Value')
        }
      }
    )
  }

}
