import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../../model/user.model';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.scss']
})
export class CommentBoxComponent implements OnInit {
  commentText: string = '';
  @Input() user: User;
  ngOnInit() {
  }
}
