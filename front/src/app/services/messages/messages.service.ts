import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {urls} from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private http: HttpClient) {
  }

  getConversation(user1: any, user2: any): Observable<any> {
    return this.http.get(urls.messages.getConversation + `?userId1=${user1}&userId2=${user2}`)
  }

  sendMessage(data:any):Observable<any>{
    return this.http.post(urls.messages.writeMessage, data)
  }


  deleteMessage(id:any):Observable<any>{
    return this.http.delete(urls.messages.writeMessage + `/${id}`)
  }

}
