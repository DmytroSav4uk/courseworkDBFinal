import {Component} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {MatFormField, MatLabel, MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MessagesService} from '../../services/messages/messages.service';
import {MatTableModule} from '@angular/material/table';
import {CommonModule} from '@angular/common';
import {catchError, of} from 'rxjs';

@Component({
  selector: 'app-messages',
  imports: [CommonModule, MatButton, FormsModule, MatFormField, MatLabel, MatInput, MatTableModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent {

  constructor(private messagesService: MessagesService) {
  }

  displayedColumns: string[] = ['messageId', 'senderId', 'receiverId', 'content', 'sentAt', 'editedAt', 'deleteMessage'];


  data: any

  user1: any
  user2: any


  submit(conForm: NgForm) {

    this.user1 = Number(conForm.value.userId1)
    this.user2 = Number(conForm.value.userId2)

    this.messagesService.getConversation(conForm.value.userId1, conForm.value.userId2).subscribe((res) => {
      this.data = res
    })
  }


  getC() {
    this.messagesService.getConversation(this.user1, this.user2).pipe(
      catchError((error) => {
        console.error('Error occurred while fetching conversation:', error);  // Log the error to the console
        this.data = null;  // Reset data to null on error
        return of(null);  // Return a safe value to prevent the observable chain from breaking
      })
    ).subscribe((res) => {
      if (res) {
        this.data = res;  // Assign the response data to 'this.data'
      } else {
        // Handle the case where data is null (e.g., display an error message to the user)
        console.log('No conversation data found.');
      }
    });
  }

  writeMessage(writeForm: NgForm) {

    this.user1 = Number(writeForm.value.senderId)
    this.user2 = Number(writeForm.value.receiverId)

    this.messagesService.sendMessage(writeForm.value).subscribe(() => {
      this.messagesService.getConversation(writeForm.value.senderId, writeForm.value.receiverId).subscribe((res) => {
        this.data = res
      })
    })
  }


  deleteMessage(messageId: any) {
    this.messagesService.deleteMessage(messageId).subscribe(() => {
      this.getC()
    })
  }
}
