import { Component, OnInit, OnDestroy } from '@angular/core';
import { MonitorServiceService } from 'src/app/services/monitor-service.service';
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
} from 'chart.js';

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
);

@Component({
  selector: 'app-cpu',
  templateUrl: './cpu.component.html',
  styleUrls: ['./cpu.component.css']
})
export class CpuComponent implements OnInit, OnDestroy {

  private intervalUpdate: any = null;
  public chart: any = null;

  constructor(private monitorService:MonitorServiceService) { }

  ngOnInit(): void {
    console.log("ngOnInit");
    //create new chart instance from chart.js
		this.chart = new Chart('realtime', {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: '%CPU usage',
          fill: false,
          data: [],
          backgroundColor: '#168ede',
          borderColor: '#168ede'
        }]
      },
      options: {
        scales: {
          y: {
              beginAtZero: true
          }
        } 
      }
     });
     this.showData();
    //update the chart with new data every second
    this.intervalUpdate = setInterval(() => {
      this.showData();
    }, 1000); 
  }
  
  ngOnDestroy(): void {
    clearInterval(this.intervalUpdate);
  }

  private showData(): void {
    console.log("showData");
		this.monitorService.getCpu().subscribe(response => {
      console.log(response);
			if(response.Status == true) {
				let chartTime: any = new Date();
				chartTime = chartTime.getHours() + ':' + ((chartTime.getMinutes() < 10) ? '0' + chartTime.getMinutes() : chartTime.getMinutes()) + ':' + ((chartTime.getSeconds() < 10) ? '0' + chartTime.getSeconds() : chartTime.getSeconds());
				if(this.chart.data.labels.length > 20) {
						this.chart.data.labels.shift();
						this.chart.data.datasets[0].data.shift();
				}
				//this.chart.data.labels.push(chartTime);
        this.chart.data.labels.push([chartTime]);
				this.chart.data.datasets[0].data.push(response.Data);
				this.chart.update();
			} else {
				console.error("ERROR: The response had an error, retrying");
			}
		}, error => {
			console.error("ERROR: Unexpected response", error);
		});
	}

}
