// Centralizing keys avoids the classic bug where one hook invalidates
// ['bookmarks'] and another reads ['bookmark'] and they silently drift apart.
export const queryKeys = {
  bookmarks: {
    all: ['bookmarks'] as const,
    inbox: ['bookmarks', 'inbox'] as const,
    favorites: ['bookmarks', 'favorites'] as const,
    unread: ['bookmarks', 'unread'] as const,
    byCollection: (collectionId: string) => ['bookmarks', 'collection', collectionId] as const,
  },
  collections: {
    all: ['collections'] as const,
  },
  tags: {
    all: ['tags'] as const,
  },
} as const;
