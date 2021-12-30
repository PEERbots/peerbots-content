import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";

import ContentRow from "../components/contentRow";
import amplitude from "amplitude-js";
import firebaseApp from "../firebase";
import { useRouter } from "next/router";

export default function TagPage() {
  const router = useRouter();
  const { tagId } = router.query;
  const db = getFirestore(firebaseApp);

  return <div>Tag page</div>;
}
