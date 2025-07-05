import { Component, EventEmitter, input, Input, OnInit, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faMinus, faReply, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Comment } from '../../model/comment.model';
import { NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { deleteComment, updateComment } from '../../store/comment.actions';
import { FormsModule } from '@angular/forms';
import { MomentFromNowPipe } from '../../service/pipe/moment-from-now.pipe';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../shared/modal/confirmation.modal.component';
import { CommentBoxComponent } from './comment-box/comment-box.component';
import { selectCurrentUser } from '../../store/comment.selector';

@Component({
    imports: [NgIf, FontAwesomeModule, FormsModule, MomentFromNowPipe, CommentBoxComponent],
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
   @Input() parentId: number;

   onReplyId: number;

    constructor(private store: Store, private ngModal: NgbModal) {
    }
    ngOnInit(): void {
       this.store.select(selectCurrentUser).subscribe(user => {
        this.currentUserName = user.username;
       })
    }

    reply(comment: Comment) {
       this.onReplyId = comment.id;
    }

    edit(comment: Comment) {
        this.isEditing = true;
        this.editText =  comment.replyingTo ? `@${comment.replyingTo} ${comment.content}`: comment.content;
    }

    update(comment: Comment) {
        this.isEditing = false;
      
        const updatedComment = {
            ...comment
        }
          updatedComment.content = this.editText.replace(/@\w+/, ``);
         this.store.dispatch(updateComment({ comment: updatedComment }));
    }

    onReply(): void {
        this.onReplyId = 0;
    }

    scoreUp(comment: Comment): void {
      
        const updatedComment = {
            ...comment
        }
         updatedComment.score += 1;
         this.store.dispatch(updateComment({ comment: updatedComment }));
    }

    scoreDown(comment: Comment): void {
      
        const updatedComment = {
            ...comment
        }
        if (updatedComment.score > 0) {
            updatedComment.score -= 1;
        }
        this.store.dispatch(updateComment({ comment: updatedComment }));
    }

    delete(id: number) {

       this.ngModal.open(ConfirmationModalComponent).result.then((r) => {
         if(r) {
            this.store.dispatch(deleteComment({ id }));
         }
       })
    }
}