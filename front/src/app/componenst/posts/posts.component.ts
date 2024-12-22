import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {PostsService} from '../../services/posts/posts.service';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from '@angular/material/expansion';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {CommentsService} from '../../services/comments/comments.service';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatLabel} from '@angular/material/input';
import {FormsModule, NgForm} from '@angular/forms';
import {LikesService} from '../../services/likes/likes.service';
import {MatSort,MatSortModule} from '@angular/material/sort';

@Component({
  selector: 'app-posts',
  imports: [MatSortModule,MatTableModule, MatExpansionPanelHeader, MatExpansionPanel, MatExpansionPanelTitle, MatIconButton, MatIcon, MatButton, MatInput, MatFormField, MatLabel, FormsModule, MatSort],
  templateUrl: './posts.component.html',
  standalone: true,
  styleUrl: './posts.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class PostsComponent implements OnInit, AfterViewInit {


  columnsToDisplay: string[] = ['postId', 'userId', 'content', 'createdAt', 'editedAt', 'likeCount', 'image'];
  expandedElement: any
  selectedFile: File | null = null;

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private service: PostsService, private commentService: CommentsService, private likesService:LikesService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.getPosts()
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  posts:any

  getPosts() {
    this.service.getPosts().subscribe((data) => {
      this.posts = data
      this.dataSource = new MatTableDataSource(this.posts)
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    })
  }


  expandedData: any;

  toggleRowExpand(row: any) {

    if (this.expandedElement === row) {
      this.expandedElement = null;
      this.expandedData = null;
    } else {

      this.expandedElement = row;
      this.expandedData = null;

      this.commentService.getCommentByPostId(row.postId).subscribe(
        (data) => {
          if (data && data.length > 0) {
            this.expandedData = data; // Set the comments if they exist
          } else {
            this.expandedData = []; // Set empty array if no comments
          }
        },
        (error) => {
          console.error('Error fetching comments:', error);
          this.expandedData = []; // Handle errors and show empty data
        }
      );
    }
  }

  get columnsToDisplayWithExpand() {
    return [...this.columnsToDisplay, 'expand'];
  }

  onSubmit(commentForm: NgForm, postId: any) {

    let body = {
      postId: postId,
      content: commentForm.value.content,
      userId: commentForm.value.userId
    }

    this.commentService.createComment(body).subscribe((res) => {
      this.commentService.getCommentByPostId(postId).subscribe(
        (data) => {
          if (data && data.length > 0) {
            this.expandedData = data; // Set the comments if they exist
            commentForm.reset()
          } else {
            this.expandedData = []; // Set empty array if no comments
          }
        })
    })}

  deletePost(postId: any) {
    this.service.deletePost(postId).subscribe(()=>{
      this.getPosts()
    })
  }

  createPost(form: NgForm){
    let formData = new FormData();
    formData.append('userId', form.value.userId);
    formData.append('content', form.value.content);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    // Debugging: Log the form data fields safely
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    this.service.createPost(formData).subscribe(()=>{

      this.selectedFile = null
      form.reset()

      this.getPosts()
    })
  }


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  submitEdit(postId:any, editForm: NgForm) {

    let formData = new FormData();
    formData.append('content', editForm.value.content);

    formData.append('postId', postId);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    // Debugging: Log the form data fields safely
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    this.service.updatePost(postId,formData).subscribe(()=>{

      this.selectedFile = null
      editForm.reset()

      this.getPosts()
    })


  }

  addLike(postId:any,likeForm:NgForm){

    let userId = Number(likeForm.value.userId);

    let body = {
      postId: postId,
      userId: userId
    }
    this.likesService.addLike(body).subscribe(()=>{})
    this.getPosts()
  }

  deleteLike(postId: any, likeForm: NgForm) {
    let userId = Number(likeForm.value.userId);
    let body = {
      postId: postId,
      userId: userId
    }
    this.likesService.removeLike(body).subscribe(()=>{})
    this.getPosts()
  }
}
