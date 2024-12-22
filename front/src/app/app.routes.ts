import { Routes } from '@angular/router';
import {UsersComponent} from './componenst/users/users.component';
import {PostsComponent} from './componenst/posts/posts.component';
import {CommentsComponent} from './componenst/comments/comments.component';
import {MessagesComponent} from './componenst/messages/messages.component';
import {LikesComponent} from './componenst/likes/likes.component';
import {FriendshipsComponent} from './componenst/friendships/friendships.component';
import {StatisticsComponent} from './componenst/statistics/statistics.component';
import {StartComponent} from './componenst/start/start.component';

export const routes: Routes = [
  {path:'users', component:UsersComponent},
  {path:'posts', component:PostsComponent},
  {path:'comments', component:CommentsComponent},
  {path:'messages', component:MessagesComponent},
  {path:'likes', component:LikesComponent},
  {path:'friendships', component:FriendshipsComponent},
  {path:'statistics', component:StatisticsComponent},
  {path:'',component:StartComponent}
];
