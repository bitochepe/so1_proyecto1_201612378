import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class MonitorServiceService {

  URL = 'http://localhost:3000/';

  constructor(private http:HttpClient) { }
  getHome(){
    return <any>this.http.get(`${this.URL}home`);
  }
  getCpu(){
    return <any>this.http.get(`${this.URL}cpu`);
  }
  getMemo(){
    return <any>this.http.get(`${this.URL}memo`);
  }
  killTask(pid:string){
    return <any>this.http.get(`${this.URL}kill/${pid}`);
  }
}
