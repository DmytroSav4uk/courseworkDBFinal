import {Component, OnInit} from '@angular/core';
import {FriendshipsService} from '../../services/friendships/friendships.service';
import {MatTableModule} from '@angular/material/table';
import {MatCard, MatCardHeader, MatCardTitle, MatCardContent} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {NgForm} from '@angular/forms';
import {FormsModule} from '@angular/forms';

import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-friendships',
  imports: [MatInput,MatTableModule, MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatButton,FormsModule,MatFormField,MatLabel],
  templateUrl: './friendships.component.html',
  styleUrl: './friendships.component.css'
})
export class FriendshipsComponent implements OnInit {

  constructor(private friendService: FriendshipsService) {
  }

  displayedColumns: string[] = ['friendshipId', 'userId1', 'userId2', 'createdAt', 'delete'];

  ngOnInit() {
    this.getFriendships()
  }

  data: any

  getFriendships() {
    this.friendService.getAllFriendShips().subscribe((res) => {
      this.data = res
      console.log(this.data)
    })
  }

  deleteFriendship(id: any) {
    this.friendService.deleteFriendship(id).subscribe(() => {
      this.getFriendships()
    })
  }

  createFriendship(formData: NgForm) {
    this.friendService.createFriendship(formData.value).subscribe(() => {
      this.getFriendships()
    })
  }
}
