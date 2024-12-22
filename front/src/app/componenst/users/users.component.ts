import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../services/users/user.service';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {FormsModule, NgForm} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatExpansionPanel, MatExpansionPanelTitle, MatExpansionPanelHeader} from '@angular/material/expansion';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {LikesService} from '../../services/likes/likes.service';
import {FriendshipsService} from '../../services/friendships/friendships.service';
import {MatSort, MatSortModule} from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-users',
  imports: [MatIconModule,MatSortModule,MatTableModule, FormsModule, MatButton, MatFormField, MatInput, MatLabel, MatIcon, MatIconButton, MatExpansionPanel, MatExpansionPanelTitle, MatExpansionPanelHeader],
  templateUrl: './users.component.html',
  standalone: true,
  styleUrl: './users.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class UsersComponent implements OnInit, AfterViewInit {

  constructor(private userService: UserService, private likesService:LikesService,private friendsService:FriendshipsService) {
  }

  displayedColumns: string[] = ['userId', 'username', 'email', 'fullName', 'bio', 'profileImage', 'createdAt', 'editedAt', 'expand'];
  users: any
  selectedFile: File | null = null;
  expandedElement: any

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {

  }

  ngAfterViewInit() {

    this.getUsers()
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  getUsers() {
    this.userService.getUsers().subscribe((res) => {
      this.users = res
      this.dataSource = new MatTableDataSource(this.users);
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    })
  }


  // @ts-ignore
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  createUser(createForm: NgForm) {

    const email = createForm.value.email;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      console.error('Invalid email address');
      return;
    }

    let formData = new FormData();
    formData.append('Username', createForm.value.username);
    formData.append('Email', createForm.value.email);
    formData.append('Password', createForm.value.passwordHash);
    formData.append('Bio', createForm.value.bio);
    formData.append('FullName', createForm.value.fullName);

    if (this.selectedFile) {
      formData.append('profileImage', this.selectedFile);
    }

    this.userService.createUser(formData).subscribe((res) => {

    })
  }


  filterUser(filterForm: NgForm) {

    const username = filterForm.value.username;
    const email = filterForm.value.email;
    const fullName = filterForm.value.fullName;

    let queryParams = '';
    if (username) {
      queryParams += `username=${username}&`;
    }
    if (email) {
      queryParams += `email=${email}&`;
    }
    if (fullName) {
      queryParams += `fullName=${fullName}&`;
    }

    if (queryParams.endsWith('&')) {
      queryParams = queryParams.slice(0, -1);
    }

    this.userService.getUsersFiltered(queryParams).subscribe((res) => {
      this.users = res
      this.dataSource = new MatTableDataSource(this.users);
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    })
  }

  toggleRowExpand(row: any) {
    if (this.expandedElement === row) {
      this.expandedElement = null;
      this.expandedData = [];
      this.expandedData2 = [];

    } else {
      this.expandedElement = row;
      this.expandedData = null;
      this.expandedData2 = null;



      this.getFriends(row.userId)

      this.likesService.GetLikedPostsByUser(row.userId).subscribe(
        (data) => {
          if (data && data.length > 0) {
            this.expandedData = data;
          }
        },
        (error) => {
          console.error('Error fetching comments:', error);
          this.expandedData = [];
        }
      );

    }
  }

  getFriends(userId:any){
    this.friendsService.getFriendsByUserId(userId).subscribe((data)=>{
      if (data && data.length > 0) {
        this.expandedData2 = data;
      } else {
        this.expandedData2 = [];
      }
    })
  }

  expandedData: any;
  expandedData2:any;

  deleteUser(userId: any) {
    this.userService.delete(userId).subscribe(()=>{
      this.getUsers()
    })
  }

  editUser(userId: any, editForm: NgForm) {

    let formData = new FormData();
    formData.append('Username', editForm.value.username);
    formData.append('Email', editForm.value.email);
    formData.append('Bio', editForm.value.bio);
    formData.append('FullName', editForm.value.fullName);

    if (this.selectedFile) {
      formData.append('profileImage', this.selectedFile);
    }

    this.userService.updateUser(userId, formData).subscribe(()=>{
      this.getUsers()
    })
  }


}
