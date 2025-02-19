import { DocumentReference } from "firebase/firestore";
import { UserRecord } from "./user";

export type Review = {
  id: string;
  content: string;
  data: {
    description: string;
    rating: number;
    user: string | UserRecord;
  };
};
