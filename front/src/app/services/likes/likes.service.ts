import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {urls} from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class LikesService {

  constructor(private http:HttpClient) { }



  getAllLikes():Observable<any>{
    return this.http.get(urls.likes.likes)
  }

  GetFilteredLikes(filters:any): Observable<any> {
    return this.http.get(urls.likes.likes + `/filter?${filters}`)
  }

  GetLikedPostsByUser(userId:any):Observable<any>{
    return this.http.get(urls.likes.getLikedPosts + `/${userId}`)
  }


  addLike(body:any):Observable<any>{
    console.log(body)
    return this.http.post(urls.likes.addLike, body)
  }

  removeLike(body:any):Observable<any>{
    console.log(body)
    return this.http.post(
      urls.likes.remove, body)
  }



}
