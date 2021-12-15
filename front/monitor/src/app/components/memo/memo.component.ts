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
  selector: 'app-memo',
  templateUrl: './memo.component.html',
  styleUrls: ['./memo.component.css']
})
export class MemoComponent implements OnInit, OnDestroy {

  private intervalUpdate: any = null;
  public chart: any = null;
  public porcentaje = 0
  public memoriaTotal = 0
  public memoriaUsada = 0
  public porcentajeS = 0
  public memoriaUsadaS = 0

  constructor(private monitorService:MonitorServiceService) { }

  ngOnInit(): void {
    this.chart = new Chart('realtime', {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Memory usage ',
          fill: false,
          data: [],
          backgroundColor: '#F19424',
          borderColor: '#F19424'
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
		this.monitorService.getMemo().subscribe(response => {  
			if(response.Status == true) {
        //sacar valores de memo
        let datos = JSON.parse(response.Data);
        console.log(datos)
        this.memoriaTotal = datos.memTotal -200;
        this.memoriaUsada = datos.memTotal -datos.memLibre + datos.memCompartida + datos.memBuffer;
        this.memoriaUsadaS = datos.memTotal -datos.memLibre -datos.memCache + datos.memCompartida + datos.memBuffer;
        this.porcentaje = this.memoriaUsada*100/this.memoriaTotal;
        this.porcentaje = Math.round(this.porcentaje * 100) / 100
        this.porcentajeS = this.memoriaUsadaS*100/this.memoriaTotal;
        this.porcentajeS = Math.round(this.porcentajeS * 100) / 100

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
