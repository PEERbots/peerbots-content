import { DocumentData } from "firebase/firestore";

export type firebaseDoc = {
  id: string;
  data: DocumentData;
};
