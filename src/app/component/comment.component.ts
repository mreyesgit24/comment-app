import { Component, input, Input, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faMinus, faReply, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Comment } from '../../model/comment.model';
import { NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { deleteComment, selectComment, updateComment } from '../../store/comment.actions';
import { selectCurrentUserName } from '../../store/comment.selector';
import { FormsModule } from '@angular/forms';
import { MomentFromNowPipe } from '../../service/pipe/moment-from-now.pipe';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../shared/modal/confirmation.modal.component';

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

    constructor(private store: Store, private ngModal: NgbModal) {
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
        this.editText = `@${comment.replyingTo} ${comment.content}`;
    }

    update(comment: Comment) {
        this.isEditing = false;
      
        const updatedComment = {
            ...comment
        }
          updatedComment.content = this.editText.replace(/@\w+/, ``);
         this.store.dispatch(updateComment({ parentId: 0, childId: comment.id, comment: updatedComment }));
    }

    scoreUp(comment: Comment): void {
      
        const updatedComment = {
            ...comment
        }
          updatedComment.score += 1;
         this.store.dispatch(updateComment({ parentId: 0, childId: comment.id, comment: updatedComment }));
    }

    scoreDown(comment: Comment): void {
      
        const updatedComment = {
            ...comment
        }
          updatedComment.score -= 1;
         this.store.dispatch(updateComment({ parentId: 0, childId: comment.id, comment: updatedComment }));
    }

    delete(id: number) {
        this.isEditing = true;
       
       this.ngModal.open(ConfirmationModalComponent).result.then((r) => {
         if(r) {
            this.store.dispatch(deleteComment({ id }));
         }
       })
    }
}