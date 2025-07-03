import { createReducer, on } from "@ngrx/store";
import { addComment, selectComment, retrieveComments, replyComment, selectCurrentUser, updateComment } from "./comment.actions";
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
    on(updateComment, (state, { id,  updatedText }) => {
        state = state.map(c => {
            return {
                ...c,
                replies: c.replies?.map(r => {
                    if (r.id === id) {
                        return {
                            ...r,
                            content: updatedText
                        };
                    }
                    return r;
                })
            }
        })

        return [...state];
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
    on(selectComment, (state, {comment}) => comment)
);  

export const currentUserReducer = createReducer(
    initialCurrentUserState,
    on(selectCurrentUser, (state, {user}) => user)
);  

function _updateComment(id: number, updatedText: string, state: Comment[]): Comment[] {
    state = state.map(c => {
            if (c.id === id) {
                return {
                    ...c,
                    content: updatedText
                };
            }
           state = _updateComment(id, updatedText, c.replies || []);
            return c;
        });

   return [...state];

}