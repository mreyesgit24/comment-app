import { createAction, emptyProps, props } from '@ngrx/store';
import { User } from '../model/user.model';
import { Comment } from '../model/comment.model';

export const addComment = createAction(
    '[Comment] Add Comment', props<{ comment: Comment }>()
);

export const updateComment = createAction(
    '[Comment] Update Comment', props<{ comment: Comment }>()
);

export const deleteComment = createAction(
    '[Comment] Delete Comment', props<{id: number }>()
);

export const replyComment = createAction(
    '[Comment] Reply Comment', props<{parentId: number, comment: Comment }>()
);

export const retrieveComments = createAction(
    '[Comment] Retrieve Comments', props<{ comments: Comment[]}>()
);
    
    
export const retrieveCurrentUser = createAction(
    '[Comment] Select Current User', props<{ user : User }>()
);