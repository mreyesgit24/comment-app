import { createReducer, on } from "@ngrx/store";
import { addComment, retrieveComments, replyComment, updateComment, deleteComment, retrieveCurrentUser } from "./comment.actions";
import { Comment } from "../model/comment.model";
import { User } from "../model/user.model";

export interface AppState {
    user: User,
    comments: Comment[]
}

export const initialState: AppState = {
    comments : [],
    user: null
}

export const commentReducer = createReducer(
    initialState,
    on(addComment, (state, { comment }) => ({
        ...state,
        comments: [...state.comments, comment]
    })),
    on(updateComment, (state, { comment }) => {
        return {
            ...state, 
            comments: state.comments.map(c => {
            return {
                    ...c,
                    replies: c.replies?.map(r => {
                        if(r.id == comment.id) {
                            return {
                                ...r,
                                ...comment
                            }
                        }
                        return r;
                    })
             };


        }).map(c => {
            if(c.id == comment.id) {
                return {
                    ...c,
                    ...comment
                }
            }

            return c;
        })
        }
    }),
    on(deleteComment, (state, { id }) => {
       return {
        ...state,
        comments: state.comments.map(c => {
            return {
                ...c,
                replies: [...(c.replies || []).filter(r => r.id !== id)]
            }
       }).filter(c => c.id !== id)
       }
    }),
    on(replyComment, (state, {parentId, comment}) => {
       return  {
        ...state,
        comments: state.comments.map(c => {
            if (c.id === parentId) {  
                return {
                    ...c,
                    replies: [...(c.replies || []), comment]
                };
            };

            return c;
        })
       }
    }),
    on(retrieveComments, (state, { comments }) => {
        return {
            ...state,
            comments
        }
    }),
    on(retrieveCurrentUser, (state, {user}) => {
       return  {
        ...state,
        user
       }
    })
);