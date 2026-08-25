import { create } from "zustand";
import { appReducer, INITIAL_STATE } from "@/data";
import { AppAction, Bookmark, Collection } from "@/types";

interface AppStoreState {
  bookmarks: Bookmark[];
  collections: Collection[];
  dispatch: (action: AppAction) => void;
}

export const useAppStore = create<AppStoreState>((set, get) => ({
  ...INITIAL_STATE,
  dispatch: (action) =>
    set((state) =>
      appReducer(
        { bookmarks: state.bookmarks, collections: state.collections },
        action,
      ),
    ),
}));
