import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../../model/user.model';
import { NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { addComment, replyComment } from '../../../store/comment.actions';
import { Comment } from '../../../model/comment.model';
import { FormsModule } from '@angular/forms';
import { selectCurrentUser } from '../../../store/comment.selector';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.scss'],
  imports: [NgIf, FormsModule]
})
export class CommentBoxComponent implements OnInit {
  commentText: string = '';
  @Input() owner: Comment;
  @Input() parentId: number;

  @Output() onReply = new EventEmitter();;

  currentUser: User;

  constructor(private store: Store){
    this.store.select(selectCurrentUser).subscribe(user => {
      this.currentUser = user;
    })
  }
  ngOnInit() {
    if(this.owner) {
      this.commentText = `@${this.owner.user.username} `
    }
  }

  sendComment() {
    const newComment: Comment = {
      id: Math.random(),
      content: this.commentText,
      createdAt: new Date().toISOString(),
      score: 0,
      user: this.currentUser
    }
    
    if(!this.owner) {
      this.store.dispatch(addComment({ comment: newComment }));
    }else {
       newComment.replyingTo = this.owner.user.username;
       newComment.content = newComment.content.replace(/@\w+/, ``);
       this.store.dispatch(replyComment({ parentId: this.parentId ?? this.owner.id, comment: newComment }));
    }

    this.commentText = ''
    this.onReply.emit();
  }
}
