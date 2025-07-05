import { commentReducer, initialState, AppState } from './comment.reducers';
import * as CommentActions from './comment.actions';
import { Comment } from '../model/comment.model';
import { User } from '../model/user.model';

describe('Comment Reducer', () => {
    const user: User = { username: 'testuser', image: { png: '' } };
    const comment1: Comment = { id: 1, content: 'First', createdAt: '', score: 0, user, replies: [] };
    const comment2: Comment = { id: 2, content: 'Second', createdAt: '', score: 0, user, replies: [] };
    const reply1: Comment = { id: 3, content: 'Reply', createdAt: '', score: 0, user, replies: [] };

    it('should return the initial state', () => {
        const action = { type: 'Unknown' } as any;
        const state = commentReducer(undefined, action);
        expect(state).toEqual(initialState);
    });

    it('should add a comment', () => {
        const action = CommentActions.addComment({ comment: comment1 });
        const state = commentReducer(initialState, action);
        expect(state.comments.length).toBe(1);
        expect(state.comments[0]).toEqual(comment1);
    });

    it('should update a comment', () => {
        const updated = { ...comment1, content: 'Updated' };
        const startState: AppState = { ...initialState, comments: [comment1] };
        const action = CommentActions.updateComment({ comment: updated });
        const state = commentReducer(startState, action);
        expect(state.comments[0].content).toBe('Updated');
    });

    it('should update a reply', () => {
        const replyUpdated = { ...reply1, content: 'Reply Updated' };
        const startState: AppState = { ...initialState, comments: [{ ...comment1, replies: [reply1] }] };
        const action = CommentActions.updateComment({ comment: replyUpdated });
        const state = commentReducer(startState, action);
        expect(state.comments[0].replies![0].content).toBe('Reply Updated');
    });

    it('should delete a comment', () => {
        const startState: AppState = { ...initialState, comments: [comment1, comment2] };
        const action = CommentActions.deleteComment({ id: 1 });
        const state = commentReducer(startState, action);
        expect(state.comments.length).toBe(1);
        expect(state.comments[0].id).toBe(2);
    });

    it('should delete a reply', () => {
        const startState: AppState = { ...initialState, comments: [{ ...comment1, replies: [reply1] }] };
        const action = CommentActions.deleteComment({ id: 3 });
        const state = commentReducer(startState, action);
        expect(state.comments[0].replies!.length).toBe(0);
    });

    it('should add a reply to a comment', () => {
        const startState: AppState = { ...initialState, comments: [comment1] };
        const action = CommentActions.replyComment({ parentId: 1, comment: reply1 });
        const state = commentReducer(startState, action);
        expect(state.comments[0].replies!.length).toBe(1);
        expect(state.comments[0].replies![0]).toEqual(reply1);
    });

    it('should retrieve comments', () => {
        const action = CommentActions.retrieveComments({ comments: [comment1, comment2] });
        const state = commentReducer(initialState, action);
        expect(state.comments.length).toBe(2);
    });

    it('should retrieve current user', () => {
        const action = CommentActions.retrieveCurrentUser({ user });
        const state = commentReducer(initialState, action);
        expect(state.user).toEqual(user);
    });
});