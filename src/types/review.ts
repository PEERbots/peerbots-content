import { DocumentReference } from "firebase/firestore";

export type Review = {
  id: string;
  content: string;
  data: {
    description: string;
    rating: number;
    user: string;
  };
};
