import { Component, OnInit } from '@angular/core';
import { MonitorServiceService } from 'src/app/services/monitor-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private monitorService:MonitorServiceService) { }

  ngOnInit(): void {
  }

}
