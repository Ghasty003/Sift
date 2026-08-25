export type Page =
  | 'dashboard'
  | 'inbox'
  | 'all-bookmarks'
  | 'collections'
  | 'collection-detail'
  | 'tags'
  | 'tag-detail'
  | 'favorites'
  | 'unread'
  | 'settings';

export interface NavState {
  page: Page;
  collectionId?: string;
  tag?: string;
}

export interface Author {
  id: string;
  displayName: string;
  username: string;
}

export interface Tweet {
  id: string;
  author: Author;
  text: string;
  createdAt: string;
  url: string;
}

export interface Bookmark {
  id: string;
  tweet: Tweet;
  savedAt: string;
  collectionId: string;
  tags: string[];
  note: string;
  isFavorite: boolean;
  isRead: boolean;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface AppState {
  bookmarks: Bookmark[];
  collections: Collection[];
}

export type AppAction =
  | { type: 'TOGGLE_FAVORITE'; id: string }
  | { type: 'TOGGLE_READ'; id: string }
  | { type: 'SET_NOTE'; id: string; note: string }
  | { type: 'MOVE_TO_COLLECTION'; id: string; collectionId: string }
  | { type: 'ADD_TAG'; id: string; tag: string }
  | { type: 'REMOVE_TAG'; id: string; tag: string }
  | { type: 'DELETE_BOOKMARK'; id: string }
  | { type: 'CREATE_COLLECTION'; collection: Collection }
  | { type: 'DELETE_COLLECTION'; id: string };
