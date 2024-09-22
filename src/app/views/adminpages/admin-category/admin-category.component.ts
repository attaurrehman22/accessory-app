import { Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";

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
    this.router.navigate(["/admin-category-product"], {
      state: { param: "Create" },
    });
  }

  allUser() {
    const dummyData = [
      {
        _id: "64116c60c3aa80a82c6a6719",
        name: "testing",
        userName: "testing",
        email: "admin122@gmail.com",
        password:
          "$2b$10$knxmbxFjGhPtUBPwMzUZiOdz2PHeiLz6ptBCEdvTuERKWUlbWTSOm",
        isActive: 65,
        createdAt: "2023-03-15T06:57:36.251Z",
        updatedAt: "2023-05-05T09:55:33.297Z",
        isBlocked: false,
        createdBy: "Admin", // Add this field
      },
      {
        _id: "64199ff04eb784eefbdc8977",
        name: "testing123",
        userName: "testing123",
        email: "admin4@gmail.com",
        picture: "global.png",
        password:
          "$2b$10$Hmrn6iGXyT/lyl3otMFvUOqZzNWPdbACkkj2R2ZFkBnUqCRADVVMa",
        isActive: 65,
        createdAt: "2023-03-21T12:15:44.837Z",
        updatedAt: "2023-05-05T09:55:33.297Z",
        isBlocked: false,
        createdBy: "Admin", // Add this field
      },
      {
        _id: "6419a0ba4eb784eefbdc89a2",
        name: "testing09",
        userName: "testing09",
        email: "admin1111@gmail.com",
        picture: "global.png",
        password:
          "$2b$10$dlfXpnp21j1YXTLwQtmAGOOLS2LAbD7z6w4YxdvX0ZGKAsuNDkODK",
        isActive: 65,
        createdAt: "2023-03-21T12:19:06.058Z",
        updatedAt: "2023-05-05T09:55:33.297Z",
        isBlocked: true,
        createdBy: "Admin", // Add this field
      },
    ];
    this.allData = dummyData;
    this.dataSource = new MatTableDataSource(dummyData);
    this.dataSource.paginator = this.paginator;
  }

  isMeOrAdminOrDeveloper(id: any): boolean {
    return true;
  }

  isAdmin(): boolean {
    return true;
  }

  editUser(data: any) {
    this.router.navigate(["/admin-category-product"], {
      state: { param: "Edit", data: data },
    });
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
