import { MemoizedSelector } from '@ngrx/store';
import * as fromSelectors from './comment.selector';
import { AppState } from './comment.reducers';
import { Comment } from '../model/comment.model';
import { User } from '../model/user.model';

describe('Comment Selectors', () => {
    const user: User = { username: 'testuser', image: { png: ''} };

    const comments: Comment[] = [
        {
            id: 1,
            content: 'First comment',
            createdAt: '2025-01-01',
            score: 5,
            user,
            replies: [
                {
                    id: 2,
                    content: 'Reply to first',
                    createdAt: '2025-01-02',
                    score: 2,
                    user,
                    replies: []
                }
            ]
        },
        {
            id: 3,
            content: 'Second comment',
            createdAt: '2025-01-03',
            score: 10,
            user,
            replies: []
        }
    ];

    const initialState: AppState = {
        comments,
        user
    };

    describe('loadCommentFeature', () => {
        it('should select the comments feature state', () => {
            const result = fromSelectors.loadCommentFeature.projector(initialState);
            expect(result).toEqual(initialState);
        });
    });

    describe('loadComments', () => {
        it('should return comments sorted by score descending', () => {
            const result = fromSelectors.loadComments.projector(initialState);
            expect(result[0].id).toBe(3); // Highest score
            expect(result[1].id).toBe(1);
        });

        it('should sort replies by createdAt ascending', () => {
            const stateWithUnsortedReplies: AppState = {
                ...initialState,
                comments: [
                    {
                        ...comments[0],
                        replies: [
                            {
                                id: 4,
                                content: 'Later reply',
                                createdAt: '2025-01-05',
                                score: 1,
                                user,
                                replies: []
                            },
                            {
                                id: 2,
                                content: 'Earlier reply',
                                createdAt: '2025-01-02',
                                score: 2,
                                user,
                                replies: []
                            }
                        ]
                    }
                ]
            };
            const result = fromSelectors.loadComments.projector(stateWithUnsortedReplies);
            expect(result[0].replies[0].id).toBe(2);
            expect(result[0].replies[1].id).toBe(4);
        });
    });

    describe('selectCurrentUser', () => {
        it('should select the current user', () => {
            const result = fromSelectors.selectCurrentUser.projector(initialState);
            expect(result).toEqual(user);
        });
    });
});