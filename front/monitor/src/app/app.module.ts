import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { CpuComponent } from './components/cpu/cpu.component';
import { MemoComponent } from './components/memo/memo.component';
import { HttpClientModule } from '@angular/common/http';
import { MonitorServiceService } from './services/monitor-service.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CpuComponent,
    MemoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    MonitorServiceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
