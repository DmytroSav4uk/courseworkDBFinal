import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {urls} from '../../config/config';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FriendshipsService {

  constructor(private http:HttpClient) { }

  getFriendsByUserId(userId:any):Observable<any>{
    return this.http.get(urls.friendships.byUser + userId)
  }



  getAllFriendShips():Observable<any>{
    return this.http.get(urls.friendships.friendships)
  }


  deleteFriendship(id:any):Observable<any>{
    return this.http.delete(urls.friendships.friendships + `/${id}`)
  }

  createFriendship(body:any):Observable<any>{
    return this.http.post(urls.friendships.friendships, body)
  }


}
