import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { HttpService } from 'src/services/http/http.service';
import { AddAttributeInventoryComponent } from '../add-attribute-inventory/add-attribute-inventory.component';

export interface attributeData {
  attribute_id: string;
  inventory_id: string;
  attribute_value_id: string;
  edit: string;
}

@Component({
  selector: 'app-attribute-inventory',
  templateUrl: './attribute-inventory.component.html',
  styleUrls: ['./attribute-inventory.component.css']
})
export class AttributeInventoryComponent {
  displayedColumns: string[] = [
    "attribute_id",
    "inventory_id",
    "attribute_value_id",
    "edit",
  ];
  dataSource: MatTableDataSource<attributeData>;
  selectedValue: string;
  allData: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private http:HttpService,
    private toast: AlertsServicesService,
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

  deleteAttribute(data) {
    this.http.deleteAdminAttributesInventory(data.attribute_id,data.inventory_id,data.attribute_value_id).subscribe(
      (res) => {
        this.toast.showAlert("success", "Attribute Delete Susseccfully");
        this.allUser();
      },
      (err) => {
        this.toast.showAlert("warning", "Error in removing Attribute");
      }
    );
  }

  allUser() {
    this.http.getAdminAttributesInventory().subscribe(
      (res)=>{
        this.allData=res.data;
        this.dataSource = new MatTableDataSource(this.allData);
        this.dataSource.paginator = this.paginator;
      }
    )
  }

  editAttribute(data: any) {
    const dialogRef = this.dialog.open(AddAttributeInventoryComponent, {
      width: '1000px',
      height: 'auto',

      data: { param: 'Edit',data: data },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
          this.allUser()
      }
    });
  }

  openModal() {
    const dialogRef = this.dialog.open(AddAttributeInventoryComponent, {
      width: '1000px',
      height: 'auto',
      data: { param: 'Create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
          this.allUser()
      }
    });
  }

}
