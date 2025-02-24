import { DocumentReference, Timestamp } from "firebase/firestore";
import { Tag } from "./tag";
import { UserRecord } from "./user";

export type Content = {
  id: string;
  data: ContentData;
};

export type ContentData = {
  name: string;
  originalName?: string;
  description?: string;
  owner: UserRecord | DocumentReference;
  copyOf?: Content | DocumentReference;
  copyDate: Timestamp;
  price?: number;
  tags: Tag[];
  public?: boolean;
  trusted?: boolean;
  templatesInfo?: { id: string; title: string }[];
};
