import { BOOKMARK_WARNING_LOCAL_STORAGE_KEY } from "../userSettingsSlice";

export default function getInitialBookmarkWarning(): boolean {
  return localStorage[BOOKMARK_WARNING_LOCAL_STORAGE_KEY] !== "disabled";
}
