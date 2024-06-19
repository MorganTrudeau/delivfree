import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { getListenersManager } from "app/utils/ListenersManager";
import { User } from "delivfree";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "app/redux/store";
import functions from "@react-native-firebase/functions";

export const listenToUsers = (
  limit: number,
  onData: (users: User[]) => void
) => {
  const query = firestore().collection("Users").limit(limit);

  return query.onSnapshot((snap) => {
    const users = snap ? snap.docs.map((doc) => doc.data() as User) : [];
    onData(users);
  });
};

export const blockUser = (activeUserId: string, userId: string) => {
  return firestore()
    .collection("Users")
    .doc(activeUserId)
    .update({ blocked: firestore.FieldValue.arrayUnion(userId) });
};

export const unblockUser = (activeUserId: string, userId: string) => {
  return firestore()
    .collection("Users")
    .doc(activeUserId)
    .update({ blocked: firestore.FieldValue.arrayRemove(userId) });
};

export const deleteAccount = () => {
  return functions().httpsCallable("deleteAccount")();
};

export const listenToUser = (
  userId: string,
  onData: (user: User | null) => void
) => {
  const query = firestore().collection("Users").doc(userId);
  const onSuccess = async (
    snapshot: FirebaseFirestoreTypes.DocumentSnapshot
  ) => {
    const user = snapshot.data() as User | null;
    onData(user);
  };
  getListenersManager().addListener("user", query, onSuccess);
};

export const createUser = createAsyncThunk<User, User, { state: RootState }>(
  "user/createUser",
  async (user) => {
    await firestore().collection("Users").doc(user.id).set(user);
    return user;
  }
);

export const isAdminUser = async (userId: string) => {
  const adminDoc = await firestore().collection("Admin").doc("users").get();
  return adminDoc.data()?.ids.includes(userId);
};

export const getUser = async (userId: string) => {
  const snap = await firestore().collection("Users").doc(userId).get();
  return snap.data() as User | null;
};

export const updateUser = async (userId: string, update: Partial<User>) => {
  return firestore().collection("Users").doc(userId).update(update);
};

export const searchUsers = async (username: string) => {
  const usersSnapshot = await firestore()
    .collection("Users")
    .where("keywords", "array-contains", username.toUpperCase())
    .get();

  return usersSnapshot.docs.map((doc) => doc.data()) as User[];
};
