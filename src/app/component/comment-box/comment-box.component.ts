import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../../model/user.model';
import { NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { addComment, replyComment } from '../../../store/comment.actions';
import { Comment } from '../../../model/comment.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.scss'],
  imports: [NgIf, FormsModule]
})
export class CommentBoxComponent implements OnInit {
  commentText: string = '';
  @Input() user: User;
  @Input() owner: Comment;
  constructor(private store: Store){

  }
  ngOnInit() {
  }

  sendComment() {
    const newComment: Comment = {
      id: 0,
      content: this.commentText,
      createdAt: new Date().toISOString(),
      score: 0,
      user: this.user,
      username:  this.user.username
    }
    
    if(!this.owner) {
      this.store.dispatch(addComment({ comment: newComment }));
    }else {
       newComment.id = Math.random();
       this.store.dispatch(replyComment({ parentId: this.owner.id, comment: newComment }));
    }
  }
}
