import { Injectable } from '@angular/core';
import * as Highcharts from 'highcharts';

@Injectable({
  providedIn: 'root'
})
export class HighchartsServiceService {

  constructor() {}

  // Method to return the configuration for a line chart
  getLineChartOptions(): any {
    return {
      chart: {
        type: 'line',
      },
      title: {
        text: '10 Year Performance',
      },
      xAxis: {
        categories: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
      },
      yAxis: {
        title: {
          text: 'Value',
        },
      },
      series: [
        {
          name: 'Performance',
          data: [1, 3, 5, 7, 10],  // The data array
        },
      ],
    };
  }
  
}
