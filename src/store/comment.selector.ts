import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState } from "./comment.reducers";

export const loadCommentFeature = createFeatureSelector<AppState>('comments');

export const loadComments = createSelector(
    loadCommentFeature, 
    state => [...state.comments].map(c => {
        return {
            ...c,
            replies: [...c.replies || []].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
        }
        return c;
    }).sort((a, b) => b.score - a.score)
)

export const selectCurrentUser = createSelector(
    loadCommentFeature,
    state => state.user
);

