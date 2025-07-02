import { Component, input, Input, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faMinus, faReply } from '@fortawesome/free-solid-svg-icons';
import { Comment } from '../../model/comment.model';
import { NgIf } from '@angular/common';

@Component({
    imports: [NgIf, FontAwesomeModule],
    selector: 'app-comment',
    templateUrl: './comment.component.html'
})
export class CommentComponent implements OnInit {
    faPlus = faPlus;
    faMinus = faMinus;
    faReply = faReply;

   @Input() comment: Comment;

    constructor() {
        // Initialization logic here
    }
    ngOnInit(): void {
       
    }
}