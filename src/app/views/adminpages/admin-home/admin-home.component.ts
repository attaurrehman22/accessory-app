import { Component } from "@angular/core";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import * as Highcharts from 'highcharts';

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
  linechart: any = {
    chart: {
      type: 'line',
    },
    series: [
      {
        data: [1, 3, 5, 7, 10],
      },
    ],
    title: {
      text: '10 Year Performance',
    },
  };

  constructor(private toast: AlertsServicesService) {}

  ngOnInit(): void {
    this.getDashBoardCardInfo();
  }

  getDashBoardCardInfo() {
    // this.api.getInfoForAdminDashBoard().subscribe((res: any) => {
    //   if (res.success) {
    //     this.cardData = res.data;
    //   } else {
    //     this.toast.danger('Something went wrong');
    //   }
    // });
  }
}
