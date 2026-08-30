// Types mirroring the API responses exactly, as given.
// These are intentionally separate from the app's existing `types.ts` shapes
// (Bookmark/Collection/AppAction) until we decide how to reconcile the two —
// see the note in the integration summary about tags/note/collection shape drift.

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
}

export interface ApiCollection {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
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

// ⚠️ ASSUMPTION — the spec said "an object containing the access token" without
// naming the field. Built against `accessToken`; if the real API returns
// `token` / `access_token` / etc., this is the one place to change.
export interface AuthResponse {
  accessToken: string;
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
