import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Comment } from "../model/comment.model";
import { User } from "../model/user.model";

export const loadComments = createFeatureSelector<Comment[]>('comments');

export const toReplyComment = createFeatureSelector<Comment>('reply');

export const selectCurrentUserState = createFeatureSelector<User>('user');

export const selectCurrentUserName = createSelector(
    selectCurrentUserState,
    (state: User) => state.username
);