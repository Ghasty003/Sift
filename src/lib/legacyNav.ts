import { Page } from "@/types";

export function pageToPath(
  page: Page,
  params?: { collectionId?: string; tag?: string },
): string {
  switch (page) {
    case "dashboard":
      return "/dashboard";
    case "inbox":
      return "/inbox";
    case "all-bookmarks":
      return "/all-bookmarks";
    case "collections":
      return "/collections";
    case "collection-detail":
      return `/collections/${params?.collectionId ?? ""}`;
    case "tags":
      return "/tags";
    case "tag-detail":
      return `/tags/${encodeURIComponent(params?.tag ?? "")}`;
    case "favorites":
      return "/favorites";
    case "unread":
      return "/unread";
    case "settings":
      return "/settings";
    default:
      return "/dashboard";
  }
}
