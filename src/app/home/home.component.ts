import { Component } from '@angular/core';
import { CommentComponent } from '../component/comment.component';
import { CommentBoxComponent } from '../component/comment-box/comment-box.component';
import { CommentService } from '../../service/comment.service';
import { NgFor, NgIf } from '@angular/common';
import { Comment } from '../../model/comment.model';
import { User } from '../../model/user.model';
import { Store } from '@ngrx/store';
import { retrieveComments, retrieveCurrentUser } from '../../store/comment.actions';
import { loadComments } from '../../store/comment.selector';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [NgIf, NgFor, CommentComponent, CommentBoxComponent],
  providers: [CommentService]
})
export class HomeComponent {
  constructor(private commentService: CommentService, private store: Store) { 
    this.store.select(loadComments).subscribe(comments => {
      this.comments = comments;
    });
  }
  comments: Comment[] = [];
  currentUser: User;
  ngOnInit() {
    this.commentService.getComments().subscribe(data => {
         this.store.dispatch(retrieveComments({ comments: data.comments}));
         this.store.dispatch(retrieveCurrentUser({ user: data.currentUser}));
    });


  }
}
