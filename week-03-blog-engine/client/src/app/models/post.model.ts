import { User } from './user.model';
import { Comment } from './comment.model';

export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  author?: User;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}
