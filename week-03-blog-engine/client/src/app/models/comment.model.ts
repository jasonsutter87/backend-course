import { User } from './user.model';

export interface Comment {
  id: number;
  content: string;
  postId: number;
  authorId: number;
  author?: User;
  createdAt: string;
}
