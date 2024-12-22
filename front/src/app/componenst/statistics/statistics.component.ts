import {Component, OnInit} from '@angular/core';
import {StatisticsService} from '../../services/statistics/statistics.service';
import {MatTableModule} from '@angular/material/table';
import {MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from '@angular/material/expansion';

import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {FormsModule, NgForm, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MonthTitlePipe} from '../../pipes/month-title.pipe';


@Component({
  selector: 'app-statistics',
  imports: [MonthTitlePipe,MatTableModule, MatExpansionPanel, MatButton, MatIcon, MatIconButton, MatExpansionPanelHeader, MatExpansionPanelTitle, FormsModule, MatFormField, MatInput, MatLabel, ReactiveFormsModule],
  templateUrl: './statistics.component.html',
  standalone: true,
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent {

  users:any
  posts:any
  likes:any
  mostLiked:any

  year:any

  displayedUserColumns: string[] = ['month', 'count'];
  displayedPostColumns: string[] = ['month', 'count'];
  displayedLikeColumns: string[] = ['month', 'count'];
  displayedMostLikedColumns: string[] = ['month', 'postId', 'likeCount'];

constructor(private service:StatisticsService) {
}



  getUsers(year:any){
    this.service.getUsersStat(year).subscribe((res)=>{
      this.users = res
    })
  }

  getPosts(year:any){
    this.service.getPostsStat(year).subscribe((res)=>{
      this.posts = res
    })
  }


  getLikes(year:any){
    this.service.getLikeCounts(year).subscribe((res)=>{
      this.likes = res
    })
  }


  getMostLikedPost(year:any){
    this.service.getMostLiked(year).subscribe((res)=>{
      this.mostLiked = res
    })
  }




  submit(myForm: NgForm) {
    this.year = Number(myForm.value.year)


    this.getUsers(this.year)
    this.getPosts(this.year)
    this.getLikes(this.year)
    this.getMostLikedPost(this.year)

  }
}
