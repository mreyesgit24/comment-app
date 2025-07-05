import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentBoxComponent } from './comment-box.component';
import { Store, StoreModule } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { of } from 'rxjs';
import { addComment, replyComment } from '../../../store/comment.actions';
import { User } from '../../../model/user.model';
import { Comment } from '../../../model/comment.model';

describe('CommentBoxComponent', () => {
    let component: CommentBoxComponent;
    let fixture: ComponentFixture<CommentBoxComponent>;
    let store: jasmine.SpyObj<Store<any>>;

    const mockUser: User = {
        username: 'testuser',
        image: { png: '' }
    };

    beforeEach(async () => {
        const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']);

        await TestBed.configureTestingModule({
            imports: [FormsModule, CommentBoxComponent],
            providers: [
                { provide: Store, useValue: storeSpy }
            ]
        }).compileComponents();

        store = TestBed.inject(Store) as jasmine.SpyObj<Store<any>>;
        store.select.and.returnValue(of(mockUser));

        fixture = TestBed.createComponent(CommentBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize commentText with owner username if owner is provided', () => {
        const owner: Comment = {
            id: 2,
            content: 'Hello',
            createdAt: '',
            score: 0,
            user: mockUser
        };
        component.owner = owner;
        component.ngOnInit();
        expect(component.commentText).toBe(`@${owner.user.username} `);
    });

    it('should dispatch addComment when owner is not set', () => {
        component.commentText = 'Test comment';
        component.owner = undefined;
        component.currentUser = mockUser;
        component.sendComment();
        expect(store.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
            type: addComment.type,
            comment: jasmine.objectContaining({
                content: 'Test comment',
                user: mockUser
            })
        }));
    });

    it('should dispatch replyComment when owner is set', () => {
        const owner: Comment = {
            id: 2,
            content: 'Hello',
            createdAt: '',
            score: 0,
            user: mockUser
        };
        component.owner = owner;
        component.parentId = 5;
        component.commentText = '@testuser reply content';
        component.currentUser = mockUser;
        component.sendComment();
        expect(store.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
            type: replyComment.type,
            parentId: 5,
            comment: jasmine.objectContaining({
                replyingTo: 'testuser',
                content: ' reply content'
            })
        }));
    });

    it('should emit onReply after sending comment', () => {
        spyOn(component.onReply, 'emit');
        component.commentText = 'Test';
        component.currentUser = mockUser;
        component.sendComment();
        expect(component.onReply.emit).toHaveBeenCalled();
    });

    it('should clear commentText after sending comment', () => {
        component.commentText = 'Some text';
        component.currentUser = mockUser;
        component.sendComment();
        expect(component.commentText).toBe('');
    });

    it('should use owner.id as parentId if parentId is not provided', () => {
        const owner: Comment = {
            id: 42,
            content: 'Owner comment',
            createdAt: '',
            score: 0,
            user: mockUser
        };
        component.owner = owner;
        component.parentId = undefined;
        component.commentText = '@testuser reply';
        component.currentUser = mockUser;
        component.sendComment();
        expect(store.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
            parentId: 42
        }));
    });
});