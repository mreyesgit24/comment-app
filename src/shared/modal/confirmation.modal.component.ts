import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-confirmation-modal',
    templateUrl: './confirmation.modal.component.html'
})
export class ConfirmationModalComponent {
    @Input() title: string = 'Confirm';
    @Input() message: string = 'Are you sure?';
    @Output() confirm = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    constructor(public modal: NgbActiveModal){
        
    }
}