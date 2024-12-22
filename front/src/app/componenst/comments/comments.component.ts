import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CommentsService} from '../../services/comments/comments.service';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatExpansionPanelHeader, MatExpansionPanel, MatExpansionPanelTitle} from '@angular/material/expansion';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {NgForm,FormsModule} from '@angular/forms';
import {MatFormField} from '@angular/material/input';
import {MatLabel} from '@angular/material/input';
import {MatInput} from '@angular/material/input';
import {MatSort,MatSortModule} from '@angular/material/sort';
@Component({
  selector: 'app-comments',
  imports: [MatSortModule,MatSort,MatInput,MatLabel,MatFormField,FormsModule,MatIconButton, MatButton, MatIcon, MatTableModule, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class CommentsComponent implements OnInit, AfterViewInit {

  constructor(private commentsService: CommentsService) {
  }

  displayedColumns: string[] = ['commentId', 'userId', 'postId', 'content', 'createdAt', 'editedAt', 'expand'];

  comments: any

  ngOnInit() {

  }


  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.getComments()

    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  getComments() {
    this.commentsService.getComments().subscribe((res) => {
      this.comments = res;


      this.dataSource = new MatTableDataSource(this.comments)
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    })
  }


  protected readonly JSON = JSON;

  deleteComment(commentId: any) {
    this.commentsService.deleteComment(commentId).subscribe(()=>{
      this.getComments()
    })
  }

  expandedElement: any


  toggleRowExpand(row: any) {
    if (this.expandedElement === row) {
      this.expandedElement = null;
    } else {
      this.expandedElement = row;
    }
  }

  submitEdit(id:any,editForm: NgForm) {
    this.commentsService.updateComment(id, editForm.value).subscribe(()=>{
      this.getComments()
    })
  }
}
