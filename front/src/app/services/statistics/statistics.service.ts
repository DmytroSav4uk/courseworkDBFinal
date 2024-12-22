import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {urls} from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private http:HttpClient) { }


  getUsersStat(year:any):Observable<any>{
    return this.http.get(urls.statistics.users + year)
  }

  getPostsStat(year:any):Observable<any>{
    return this.http.get(urls.statistics.posts + year)
  }

  getLikeCounts(year:any):Observable<any>{
    return this.http.get(urls.statistics.likes + year)
  }

  getMostLiked(year:any):Observable<any>{
    return this.http.get(urls.statistics.mostLiked + year)
  }

}
