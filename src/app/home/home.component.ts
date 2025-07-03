import { Component } from '@angular/core';
import { CommentComponent } from '../component/comment.component';
import { CommentBoxComponent } from '../component/comment-box/comment-box.component';
import { CommentService } from '../../service/comment.service';
import { NgFor, NgIf } from '@angular/common';
import { Comment } from '../../model/comment.model';
import { User } from '../../model/user.model';
import { Store } from '@ngrx/store';
import { retrieveComments, selectCurrentUser } from '../../store/comment.actions';
import { loadComments, toReplyComment } from '../../store/comment.selector';

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
  currentReply: Comment;
  currentUser: User;
  ngOnInit() {
    this.commentService.getComments().subscribe(data => {
     // this.comments = data.comments || [];
         this.store.dispatch(retrieveComments({ comments: data.comments}));
         this.store.dispatch(selectCurrentUser({ user: data.currentUser}));
      this.currentUser = data.currentUser;
    });

    this.store.select(toReplyComment).subscribe(comment => {
      this.currentReply = comment
    });

  }
}
