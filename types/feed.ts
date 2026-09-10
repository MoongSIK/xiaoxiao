export type FeedComment = {
  id: string;
  author: string;
  content: string;
  isReply: boolean;
  replyTo: string;
};

export type FeedPost = {
  id: string;
  author: string;
  profileImage: string;
  content: string;
  postImage?: string;

  liked: boolean;
  likedBy: string;

  comments: FeedComment[];
};

export type FeedProject = {
  title: string;
  posts: FeedPost[];
};