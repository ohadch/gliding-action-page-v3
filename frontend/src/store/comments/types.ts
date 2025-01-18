import { CommentSchema } from '../../lib/types';
import { BaseInitialState } from '../types/base';

export interface CommentsState extends BaseInitialState {
    comments: CommentSchema[];
} 