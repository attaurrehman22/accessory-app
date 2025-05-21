import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { HttpService } from 'src/services/http/http.service';
import { AddAttributeComponent } from '../add-attribute/add-attribute.component';

export interface AttributeData {
  name: any;
   action: any;
}

@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.css']
})
export class AttributeComponent {
  displayedColumns: string[] = [
    "name",
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
      this.http.getAttributesType().subscribe((res) => {
        this.accessoryCategoryList = res.data;
        this.dataSource = new MatTableDataSource(this.accessoryCategoryList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
  
    openModal() {
      const dialogRef = this.dialog.open(AddAttributeComponent, {
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
       const dialogRef = this.dialog.open(AddAttributeComponent, {
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
      this.http.deleteAttributesType(data.id).subscribe(
        (res)=>{
          this.alertService.showAlert('success','Attribute delete successfully')
          this.getAllAccessoryCategories();
        },(err)=>{
          if(err?.error?.message){
            this.alertService.showAlert('warning',err.error.message)
          }else{
            this.alertService.showAlert('warning','Error in deleting Attribute')
          }
        }
      )
    }
  }
  