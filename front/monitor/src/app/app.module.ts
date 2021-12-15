import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { CpuComponent } from './components/cpu/cpu.component';
import { MemoComponent } from './components/memo/memo.component';
import { HttpClientModule } from '@angular/common/http';
import { MonitorServiceService } from './services/monitor-service.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CpuComponent,
    MemoComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AccordionModule.forRoot(),
    TooltipModule.forRoot()
  ],
  providers: [
    MonitorServiceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
