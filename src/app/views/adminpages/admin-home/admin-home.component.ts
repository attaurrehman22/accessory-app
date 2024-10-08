import { Component } from "@angular/core";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import * as Highcharts from "highcharts";
import { HighchartsServiceService } from "src/services/highcharts-service/highcharts-service.service";
import { ChangeDetectorRef } from "@angular/core"; // Import ChangeDetectorRef
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: "app-admin-home",
  templateUrl: "./admin-home.component.html",
  styleUrls: ["./admin-home.component.css"],
})
export class AdminHomeComponent {
  cardData = {
    totalUsers: 0,
    totalPlayers: 0,
    presentPlayers: 0,
    totalPlayersWhoPaidFee: 0,
  };

  displayedColumns: string[] = ["id", "name", "email"];
  dataSource = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com" },
  ];
  Highcharts = Highcharts;
  linechart: any;
  dashboarddetails = {
    totalNumberOfBrands: 0
    , totalNumberOfBrandsWithActiveSubscription: 0
    , totalNumberOfCatagory: 0
    , activeBrandsCount: 0
    , topBrandsCount: 0
    , totalNumberOfUsers: 0
    , totalNumberOfUsersWithActiveSubscription: 0
    , totalNumberOfUsersWithSubscription: 0
    , totalNumberOfUsersWithoutSubscription: 0
    , totalNumberOfProducts: 0
  };

  constructor(
    private toast: AlertsServicesService,
    private highchartsService: HighchartsServiceService,
    private cd: ChangeDetectorRef,
    private http: HttpService
  ) { }
  ngOnInit(): void {
    this.getDashboardDetails();
    this.getDashBoardCardInfo();
    this.loadHighcharts();
  }

  getDashboardDetails() {
    this.http.getAdminDashBoardDetails().subscribe(
      (res) => {
        this.dashboarddetails = res.data;
      }
    )
  }

  loadHighcharts() {
    this.linechart = this.highchartsService.getLineChartOptions();
    console.log(this.linechart);
    this.cd.detectChanges();
  }

  getDashBoardCardInfo() {

  }
}
