import { createReducer, on } from "@ngrx/store";
import { addComment, selectComment, retrieveComments, replyComment, selectCurrentUser, updateComment, deleteComment, clearComment } from "./comment.actions";
import { Comment } from "../model/comment.model";

export interface CurrentUserState {
      username: string;
      image: {
        png: string;
      }
    }

    export const initialCurrentUserState: CurrentUserState = {
        username: '',
        image: {
            png: ''
        }
    };


export const initialState: Comment[] = [];

export const selectedReplyState: any = null;

export const commentReducer = createReducer(
    initialState,
    on(addComment, (state, { comment }) => [...state, comment]),
    on(updateComment, (state, { parentId, childId,  comment }) => {
      

         state = state.map(c => {
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
        });

        return [...state];
    }),
    on(deleteComment, (state, { id }) => {
       return state.map(c => {
            return {
                ...c,
                replies: [...(c.replies || []).filter(r => r.id !== id)]
            }
       }).filter(c => c.id !== id)
    }),
    on(retrieveComments, (state, { comments }) => comments),
    on(replyComment, (state, {parentId, comment}) => {

         state = state.map(c => {
            if (c.id === parentId) {  
                return {
                    ...c,
                    replies: [...(c.replies || []), comment]
                };
            };

            return c;
        });

       return  [...state];
    })
);

export const replyReducer = createReducer(
    selectedReplyState,
    on(selectComment, (state, {comment}) => comment),
    on(clearComment, (state, _) => selectedReplyState)
);  

export const currentUserReducer = createReducer(
    initialCurrentUserState,
    on(selectCurrentUser, (state, {user}) => user)
);  