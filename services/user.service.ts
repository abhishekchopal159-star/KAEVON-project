import {
  updateProfile,
  type User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type DocumentData,
  type DocumentSnapshot,
  type Unsubscribe,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type AccountProfileGender =
  | "female"
  | "male"
  | "non-binary"
  | "prefer-not-to-say"
  | "";

export type SubscriptionPlan =
  | "free"
  | "prive";

export type AccountProfile = {
  uid: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  photoURL: string;
  dateOfBirth: string;
  gender: AccountProfileGender;
  role: string;
  subscriptionPlan: SubscriptionPlan;
  createdAt: Date | null;
};

export type EditableAccountProfile = {
  displayName: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: AccountProfileGender;
};

function readString(
  value: unknown,
  fallback = ""
) {
  return typeof value === "string"
    ? value.trim()
    : fallback;
}

function readDate(value: unknown) {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return value.toDate() as Date;
  }

  return null;
}

function normalizeUserProfile(
  snapshot: DocumentSnapshot<DocumentData>
): AccountProfile | null {
  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();
  const gender = readString(
    data.gender
  ) as AccountProfileGender;

  return {
    uid: readString(
      data.uid,
      snapshot.id
    ),
    displayName: readString(
      data.displayName
    ),
    email: readString(data.email),
    phoneNumber: readString(
      data.phoneNumber
    ),
    photoURL: readString(data.photoURL),
    dateOfBirth: readString(
      data.dateOfBirth
    ),
    gender: [
      "female",
      "male",
      "non-binary",
      "prefer-not-to-say",
      "",
    ].includes(gender)
      ? gender
      : "",
    role: readString(
      data.role,
      "customer"
    ),
    subscriptionPlan:
      data.subscriptionPlan === "prive"
        ? "prive"
        : "free",
    createdAt: readDate(data.createdAt),
  };
}

export function subscribeToUserProfile(
  uid: string,
  onProfile: (
    profile: AccountProfile | null
  ) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, "users", uid),
    (snapshot) => {
      onProfile(
        normalizeUserProfile(snapshot)
      );
    },
    (error) => onError?.(error)
  );
}

export async function ensureUserProfile(
  user: User
) {
  const userReference = doc(
    db,
    "users",
    user.uid
  );
  const snapshot = await getDoc(
    userReference
  );

  if (snapshot.exists()) {
    const currentProfile =
      snapshot.data();
    const currentRole = readString(
      currentProfile.role,
      "customer"
    );
    const currentSubscription =
      currentRole === "admin" ||
      currentProfile.subscriptionPlan === "prive"
        ? "prive"
        : "free";

    await setDoc(
      userReference,
      {
        uid: user.uid,
        displayName:
          readString(
            currentProfile.displayName
          ) || user.displayName || "",
        email: user.email ?? "",
        phoneNumber:
          readString(
            currentProfile.phoneNumber
          ) || user.phoneNumber || "",
        photoURL:
          readString(
            currentProfile.photoURL
          ) || user.photoURL || "",
        dateOfBirth: readString(
          currentProfile.dateOfBirth
        ),
        gender: readString(
          currentProfile.gender
        ),
        role: currentRole,
        subscriptionPlan:
          currentSubscription,
        lastActiveAt: serverTimestamp(),
      },
      { merge: true }
    );
    return;
  }

  await setDoc(userReference, {
    uid: user.uid,
    displayName: user.displayName ?? "",
    email: user.email ?? "",
    phoneNumber: user.phoneNumber ?? "",
    photoURL: user.photoURL ?? "",
    dateOfBirth: "",
    gender: "",
    role: "customer",
    subscriptionPlan: "free",
    createdAt: serverTimestamp(),
    lastActiveAt: serverTimestamp(),
  });
}

export async function updateUserPersonalDetails(
  user: User,
  values: EditableAccountProfile
) {
  const displayName =
    values.displayName.trim();

  if (!displayName) {
    throw new Error(
      "Please enter your full name."
    );
  }

  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      email: user.email ?? "",
      displayName,
      phoneNumber:
        values.phoneNumber.trim(),
      dateOfBirth: values.dateOfBirth,
      gender: values.gender,
      updatedAt: serverTimestamp(),
      lastActiveAt: serverTimestamp(),
    },
    { merge: true }
  );

  if (
    user.displayName !== displayName
  ) {
    await updateProfile(user, {
      displayName,
    });
  }
}
