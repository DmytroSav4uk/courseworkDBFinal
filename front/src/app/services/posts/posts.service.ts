import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {urls} from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http:HttpClient) { }

  getPosts():Observable<any>{
    return this.http.get(urls.posts.posts)
  }

  getPostImage(postId: number): Observable<string> {
    return this.http.get<string>(`${urls.posts.posts}/${postId}/image`);
  }

  createPost(body:any):Observable<any>{
    return this.http.post(urls.posts.posts, body)
  }

  updatePost(id:any, body:any):Observable<any>{
    return this.http.put(urls.posts.posts + `/${id}`, body)
  }

  deletePost(id:any):Observable<any>{
    return this.http.delete(urls.posts.posts + `/${id}`)
  }


}
