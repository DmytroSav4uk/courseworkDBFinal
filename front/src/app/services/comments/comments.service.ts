import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {urls} from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http:HttpClient) { }

  getComments():Observable<any>{
    return this.http.get(urls.comments.comments)
  }

  getCommentByPostId(id:any):Observable<any>{
    return this.http.get(urls.comments.commentsByPost + '/' + id)
  }


  createComment(body:any):Observable<any>{
    return this.http.post(urls.comments.comments, body)
  }

  updateComment(id:any, body:any):Observable<any>{
    return this.http.put(urls.comments.comments + `/${id}`, body)
  }

  deleteComment(id:any):Observable<any>{
    return this.http.delete(urls.comments.comments + `/${id}`)
  }




}
