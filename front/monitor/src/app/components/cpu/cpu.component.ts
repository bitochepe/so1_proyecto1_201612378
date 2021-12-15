import { Component, OnInit, OnDestroy } from '@angular/core';
import { MonitorServiceService } from 'src/app/services/monitor-service.service';
import {
  Chart,
  LineElement,
  PointElement,
  LineController,
  ScatterController,
  CategoryScale,
  LinearScale,
  Filler,
  Legend,
  Title,
  Tooltip
} from 'chart.js';

Chart.register(
  LineElement,
  PointElement,
  LineController,
  ScatterController,
  CategoryScale,
  LinearScale,
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
  private datos: any
  public porcentaje = 0

  constructor(private monitorService:MonitorServiceService) { }

  ngOnInit(): void {
		this.chart = new Chart('realtime', {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'CPU usage ',
          fill: false,
          data: [],
          backgroundColor: '#168ede',
          borderColor: '#168ede'  
        }]
      },
      options: {
        scales: {
          y: {
            min: 0,
            max: 100 
          }
        } 
      }
     });
     this.showData();

     this.intervalUpdate = setInterval(() => {
      this.showData();
    }, 1000); 
  }
  
  ngOnDestroy(): void {
    clearInterval(this.intervalUpdate);
  }

  private showData(): void {
		this.monitorService.getCpu().subscribe(response => {  
			if(response.Status == true) {
        //sacar valores de cpu
        this.datos = response.Data.split("\n");
        this.datos.shift()
        this.porcentaje = 0
        this.datos.forEach(element => {
          if(element.length >1){
            this.porcentaje = this.porcentaje + parseFloat(element)
          }
        });
        this.porcentaje = Math.round(this.porcentaje * 100) / 100
        if(this.porcentaje > 100) {this.porcentaje = 100}

        //valores de abajo
				let chartTime: any = new Date();
				chartTime = chartTime.getHours() + ':' + ((chartTime.getMinutes() < 10) ? '0' + chartTime.getMinutes() : chartTime.getMinutes()) + ':' + ((chartTime.getSeconds() < 10) ? '0' + chartTime.getSeconds() : chartTime.getSeconds());
				if(this.chart.data.labels.length > 30) {
						this.chart.data.labels.shift();
						this.chart.data.datasets[0].data.shift();
				}
        this.chart.data.labels.push([chartTime]);
				this.chart.data.datasets[0].data.push(this.porcentaje);
				this.chart.update();
			} else {
				console.error("ERROR: The response had an error, retrying");
			}
		}, error => {
			console.error("ERROR: Unexpected response", error);
		});
	}

}
