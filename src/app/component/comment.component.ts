import { Component, input, Input, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faMinus, faReply, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Comment } from '../../model/comment.model';
import { NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectComment, updateComment } from '../../store/comment.actions';
import { selectCurrentUserName } from '../../store/comment.selector';
import { FormsModule } from '@angular/forms';
import { MomentFromNowPipe } from '../../service/pipe/moment-from-now.pipe';

@Component({
    imports: [NgIf, FontAwesomeModule, FormsModule, MomentFromNowPipe],
    selector: 'app-comment',
    styleUrls: ['./comment.component.scss'],
    templateUrl: './comment.component.html'
})
export class CommentComponent implements OnInit {
    faPlus = faPlus;
    faMinus = faMinus;
    faReply = faReply;
    faEdit = faEdit;
    faTrash = faTrash;
    currentUserName: string = '';
    isEditing: boolean = false;
    editText: string = '';

   @Input() comment: Comment;

    constructor(private store: Store) {
        this.store.select(selectCurrentUserName).subscribe(username => {
            this.currentUserName = username;
        });
    }
    ngOnInit(): void {
       
    }

    reply(comment: Comment) {
        this.store.dispatch(selectComment({ comment: comment }));
    }

    edit(comment: Comment) {
        this.isEditing = true;
        this.editText = comment.content;
    }

    update(comment: Comment) {
        this.isEditing = false;
      
        const updatedComment = {
            ...comment
        }
          updatedComment.content = this.editText;
         this.store.dispatch(updateComment({ parentId: 0, childId: comment.id, comment: updatedComment }));
    }
}