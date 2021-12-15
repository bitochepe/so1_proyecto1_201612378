import { Component, OnInit } from '@angular/core';
import { MonitorServiceService } from 'src/app/services/monitor-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {s

  public intervalUpdate;
  public totalProcesos;
  public totalDetenido;
  public totalCorriendo;
  public totalSuspendido;
  public totalZobie;

  constructor(private monitorService:MonitorServiceService) { }

  ngOnInit(): void {
    this.getDatos();
    this.intervalUpdate = setInterval(() => {
      this.getDatos();
    }, 3000); 
  }

  getDatos(){
    this.monitorService.getHome().subscribe(response => {  
      if(response.Status == true){
        let data = JSON.parse(response.Data);
        let memo = JSON.parse(response.MemHome+'"memCache": 0}');
        data.procesos.forEach(element => {
          element.Memoria = Math.round( (element.Memoria*100/(memo.memTotal*1024*1024)) * 100) / 100
        });
        this.totalProcesos = data.TotalProcesos;
        this.totalDetenido = data.TotalDetenido;
        this.totalCorriendo = data.TotalEjecucion;
        this.totalSuspendido = data.TotalSuspendido;
        this.totalZobie = data.TotalZombie;
      }
      else {
				console.error("ERROR: The response had an error, retrying");
			}
		}, error => {
			console.error("ERROR: Unexpected response", error);
		});
  }

}
