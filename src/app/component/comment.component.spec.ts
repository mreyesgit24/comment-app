import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentComponent } from './comment.component';
import { Store, StoreModule } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { Comment } from '../../model/comment.model';
import { updateComment, deleteComment } from '../../store/comment.actions';
import { selectCurrentUser } from '../../store/comment.selector';

describe('CommentComponent', () => {
    let component: CommentComponent;
    let fixture: ComponentFixture<CommentComponent>;
    let storeSpy: jasmine.SpyObj<Store<any>>;
    let modalSpy: jasmine.SpyObj<NgbModal>;

    const mockComment: Comment = {
        id: 1,
        content: 'Test comment',
        createdAt: '2024-06-01',
        score: 2,
        user: { username: 'user1', image: { png: '' } },
        replies: []
    };

    beforeEach(async () => {
        storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']);
        modalSpy = jasmine.createSpyObj('NgbModal', ['open']);

        await TestBed.configureTestingModule({
            imports: [StoreModule.forRoot({}), CommentComponent],
            providers: [
                { provide: Store, useValue: storeSpy },
                { provide: NgbModal, useValue: modalSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CommentComponent);
        component = fixture.componentInstance;
        component.comment = { ...mockComment };
        storeSpy.select.and.callFake((selector) => {
            if (selector === selectCurrentUser) {
                return of({ username: 'user1' });
            }
            return of();
        });
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set currentUserName on init', () => {
        expect(component.currentUserName).toBe('user1');
    });

    it('should set onReplyId when reply is called', () => {
        component.reply(mockComment);
        expect(component.onReplyId).toBe(mockComment.id);
    });

    it('should set isEditing and editText when edit is called', () => {
        component.edit(mockComment);
        expect(component.isEditing).toBeTrue();
        expect(component.editText).toBe(mockComment.content);
    });

    it('should update comment and dispatch updateComment', () => {
        component.isEditing = true;
        component.editText = 'Updated content';
        component.update(mockComment);
        expect(component.isEditing).toBeFalse();
        expect(storeSpy.dispatch).toHaveBeenCalledWith(updateComment({
            comment: {...mockComment, content: 'Updated content'}
        }));
    });

    it('should reset onReplyId when onReply is called', () => {
        component.onReplyId = 5;
        component.onReply();
        expect(component.onReplyId).toBe(0);
    });

    it('should increment score and dispatch updateComment', () => {
        const comment = { ...mockComment, score: 1 };
        component.scoreUp(comment);
        expect(storeSpy.dispatch).toHaveBeenCalledWith(updateComment({
            comment: {...comment, score: 2}
        }));
    });

    it('should decrement score and dispatch updateComment', () => {
        const comment = { ...mockComment, score: 2 };
        component.scoreDown(comment);
        expect(storeSpy.dispatch).toHaveBeenCalledWith(updateComment({
            comment: {...comment, score :1}
        }));
    });

    it('should not decrement score below 0', () => {
        const comment = { ...mockComment, score: 0 };
        component.scoreDown(comment);
        expect(storeSpy.dispatch).toHaveBeenCalledWith(updateComment({
            comment: {...comment, score: 0}
        }));
    });

    it('should open modal and dispatch deleteComment on confirm', async () => {
        const modalRef = {
            result: Promise.resolve(true)
        };
        modalSpy.open.and.returnValue(modalRef as any);

        await component.delete(1);
        expect(modalSpy.open).toHaveBeenCalled();
        setTimeout(() => {
            expect(storeSpy.dispatch).toHaveBeenCalledWith(deleteComment({ id: 1 }));
        });
    });

    it('should not dispatch deleteComment if modal is cancelled', async () => {
        const modalRef = {
            result: Promise.resolve(false)
        };
        modalSpy.open.and.returnValue(modalRef as any);

        await component.delete(1);
        expect(modalSpy.open).toHaveBeenCalled();
        setTimeout(() => {
            expect(storeSpy.dispatch).not.toHaveBeenCalledWith(deleteComment({ id: 1 }));
        });
    });
});