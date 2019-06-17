import { Component, OnInit } from '@angular/core';
import { Track } from '../../models/track';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css'],
  providers: [DataService]
})

export class TrackComponent implements OnInit {

  public trackingData: Track;

  public barChartDataWeek: any[];
  public barChartDataMonth: any[];
  public barChartDataYear: any[];

  constructor(private _dataService: DataService) {

    this.trackingData = {
      workoutTimeOfDay: 0,
      workoutTimeOfWeek: 0,
      workoutTimeOfMonth: 0,
      weekTotalCaloriesBurnt: 0,
      monthTotalCaloriesBurnt: 0,
      yearTotalCaloriesBurnt: 0,
      dayWiseCaloryBurnData: [],
      weekWiseCaloryBurnData: [],
      monthWiseCaloryBurnData: [],
      relativeTimestamp: ''
    };

    this.barChartDataWeek = [{
      label: 'Total Calories',
      data: []
    }];

    this.barChartDataMonth = [{
      label: 'Total Calories',
      data: []
    }];

    this.barChartDataYear = [{
      label: 'Total Calories',
      data: []
    }];
  }

  ngOnInit() {
    
    var reqTrack = new Track();
    reqTrack.relativeTimestamp = "";

    this._dataService
      .add<Track>('Tracking', reqTrack)
      .subscribe(
        (data: Track) => {
          
          this.trackingData = data;

          if (this.trackingData) {
            if (this.trackingData.dayWiseCaloryBurnData) {
              var weekData = [];
              for (var i = 0; i < this.trackingData.dayWiseCaloryBurnData.length; i++) {
                weekData.push(this.trackingData.dayWiseCaloryBurnData[i].value);
              }
              this.barChartDataWeek = [{
                label: 'Total Calories',
                data: weekData
              }];
            }

            if (this.trackingData.weekWiseCaloryBurnData) {
              var monthData = [];
              for (var i = 0; i < this.trackingData.weekWiseCaloryBurnData.length; i++) {
                monthData.push(this.trackingData.weekWiseCaloryBurnData[i].value);
              }
              this.barChartDataMonth = [{
                label: 'Total Calories',
                data: monthData
              }];
            }

            if (this.trackingData.monthWiseCaloryBurnData) {
              var yearData = [];
              for (var i = 0; i < this.trackingData.monthWiseCaloryBurnData.length; i++) {
                yearData.push(this.trackingData.monthWiseCaloryBurnData[i].value);
              }
              this.barChartDataYear = [{
                label: 'Total Calories',
                data: yearData
              }];
            }
          }
        },
        error => () => {
          this.trackingData = null;
        });
  }

  /*
  ************************************** Chart Configuration ****************************************
  */
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };

  public barChartType: string = 'bar';
  public barChartLegend: boolean = false;

  public barChartLabelsWeek: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  public barChartLabelsMonth: string[] = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];
  public barChartLabelsYear: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  private colors = [
    {
      backgroundColor: [
        '#3e95cd',
        '#8e5ea2',
        '#3cba9f',
        '#EF5350',
        '#e8c3b9',
        '#c45850',
        '#FFA726',
        '#EC407A',
        '#66BB6A',
        '#FF7043',
        '#616161',
        '#AFB42B'
      ]
    }];
}
