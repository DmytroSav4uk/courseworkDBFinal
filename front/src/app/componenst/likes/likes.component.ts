import {Component, OnInit} from '@angular/core';
import {LikesService} from '../../services/likes/likes.service';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';

import {NgForm} from '@angular/forms';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-likes',
  imports: [FormsModule, MatTableModule, MatInputModule],
  templateUrl: './likes.component.html',
  styleUrl: './likes.component.css',
})
export class LikesComponent implements OnInit {

  displayedColumns: string[] = ['likeId', 'userId', 'postId', 'likedAt'];

  constructor(private likesService: LikesService) {
  }

  ngOnInit() {
    this.getLikes()
  }

  likes: any


  getLikes() {
    this.likesService.getAllLikes().subscribe((res) => {
      this.likes = res
    })
  }


  onSubmit(filters: NgForm): void {


    let userId = filters.value.userId
    let postId = filters.value.postId


    let queryParams = '';
    if (userId) {
      queryParams += `userId=${userId}&`;
    }
    if (postId) {
      queryParams += `postId=${postId}&`;
    }

    if (queryParams.endsWith('&')) {
      queryParams = queryParams.slice(0, -1);
    }

    this.likesService.GetFilteredLikes(queryParams).subscribe(
      (response) => {
        this.likes = response;
      })
  }
}
