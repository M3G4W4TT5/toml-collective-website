import snapshot from "./instagram-snapshot.json";

export const instagramSnapshot = snapshot;
export type InstagramPost = (typeof snapshot.posts)[number];
export type InstagramMedia = InstagramPost["media"][number];
