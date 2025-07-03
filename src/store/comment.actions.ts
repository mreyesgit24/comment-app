import { createAction, props } from '@ngrx/store';
import { User } from '../model/user.model';
import { Comment } from '../model/comment.model';

export const addComment = createAction(
    '[Comment] Add Comment', props<{ comment: Comment }>()
);

export const updateComment = createAction(
    '[Comment] Update Comment', props<{ id: number, updatedText: string }>()
);

export const replyComment = createAction(
    '[Comment] Reply Comment', props<{parentId: number, comment: Comment }>()
);

export const retrieveComments = createAction(
    '[Comment] Retrieve Comments', props<{ comments: Comment[]}>()
);
    
export const selectComment = createAction(
    '[Comment] Select Comment', props<{ comment : Comment }>()
);
    
export const selectCurrentUser = createAction(
    '[Comment] Select Current User', props<{ user : User }>()
);