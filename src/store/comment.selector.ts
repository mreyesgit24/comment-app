import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Comment } from "../model/comment.model";
import { User } from "../model/user.model";

export const loadCommentFeature = createFeatureSelector<Comment[]>('comments');

export const toReplyComment = createFeatureSelector<Comment>('reply');

export const selectCurrentUserState = createFeatureSelector<User>('user');

export const selectCurrentUserName = createSelector(
    selectCurrentUserState,
    (state: User) => state.username
);

export const loadComments = createSelector(
    loadCommentFeature, 
    (list) => [...list].map(c => {
        return {
            ...c,
            replies: [...c.replies || []].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
        }
        return c;
    }).sort((a, b) => b.score - a.score)
)