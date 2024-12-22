import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {urls} from '../../config/config';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  getUsers():Observable<any>{
    return this.http.get(urls.users.users)
  }

  getUsersFiltered(filter:any):Observable<any>{
    return this.http.get(urls.users.users + `/filter?${filter}`)
  }

  createUser(body:any):Observable<any>{
    return this.http.post(urls.users.users, body)
  }

  updateUser(id:any, body:any):Observable<any>{
    return this.http.put(urls.users.users + `/${id}`, body)
  }

  delete(id:any):Observable<any>{
    return this.http.delete(urls.users.users + `/${id}`)
  }
}
