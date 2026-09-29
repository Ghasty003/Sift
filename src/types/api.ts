export interface ApiTweet {
  tweetId: string;
  url: string;
  authorUsername: string;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface ApiTag {
  id: string;
  name: string;
  bookmarkCount: number;
}

export interface ApiCollection {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  bookmarkCount: number;
  unreadCount: number;
}

export interface ApiNote {
  id: string;
  bookmarkId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiBookmark {
  id: string;
  tweet: ApiTweet;
  collection: ApiCollection | null;
  isFavorite: boolean;
  isRead: boolean;
  savedAt: string;
  tags: ApiTag[];
  note: ApiNote | null;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends AuthCredentials {
  fullName: string;
}

export interface CurrentUser {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  hasPassword: boolean;
}

export interface AuthResponse {
  accessToken: string;
  user: CurrentUser;
}

export interface CreateCollectionPayload {
  name: string;
  description: string;
}

export interface CreateTagPayload {
  name: string;
}

export interface UpsertNotePayload {
  content: string;
}
