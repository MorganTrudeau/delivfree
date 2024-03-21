import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

let listenersManager: ListenersManager | undefined;
export const getListenersManager = () => {
  if (!listenersManager) {
    listenersManager = new ListenersManager();
  }
  return listenersManager;
};

class ListenersManager {
  listeners = new Map<string, FirestoreListener>();
  dateListeners = new Map<string, () => void>();
  errors = new Set<string>();
  errorRetryTimeouts = new Map<string, NodeJS.Timeout>();

  listenerExists = (id: string) => {
    return this.listeners.has(id);
  };

  handleSuccess: HandleSuccess = (id, onSuccess) => {
    return (snapshot) => {
      console.log(`Success [${id}]`);
      onSuccess(snapshot);
    };
  };

  handleError: HandleError = (id, query, onSuccess, onError) => {
    return (error: Error) => {
      console.log(`Listener error [${id}] ${error}`, this.errors.has(id));
      if (this.errors.has(id)) {
        this.cancelErrorRetryTimeout(id);
        onError && onError(error);
      } else {
        const timeout = setTimeout(() => {
          this.addListener(id, query, onSuccess, onError);
        }, 2000);
        console.log(this.errors);
        this.errors.add(id);
        this.errorRetryTimeouts.set(id, timeout);
      }
    };
  };

  addListener: AddListener = (id, query, onSuccess, onError) => {
    console.log(`Add listener [${id}]`);
    if (this.listenerExists(id)) {
      this.removeListener(id);
    }

    // @ts-ignore
    const listener = query.onSnapshot(
      this.handleSuccess(id, onSuccess),
      this.handleError(id, query, onSuccess, onError)
    );
    this.listeners.set(id, listener);
  };

  removeListener = (id: string) => {
    this.cancelErrorRetryTimeout(id);
    const listener = this.listeners.get(id);
    if (listener) {
      console.log(`Remove listener [${id}]`);
      this.firebaseOff(listener);
      this.listeners.delete(id);
    }
  };

  cancelErrorRetryTimeout = (id: string) => {
    const timeout = this.errorRetryTimeouts.get(id);
    if (timeout) {
      clearTimeout(timeout);
      this.errorRetryTimeouts.delete(id);
    }
  };

  removeAllListeners = () => {
    this.listeners.forEach((val, id) => {
      this.removeListener(id);
    });
  };

  firebaseOff: FirestoreOff = (listener) => {
    listener();
  };
}

// TYPES

type FirestoreListener = () => void;

type FirestoreQuery =
  | FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData>
  | FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>;

type FirestoreSnapshot<Q> =
  Q extends FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData>
    ? FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>
    : FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>;

type FirestoreOff = (listener: FirestoreListener) => void;

type HandleSuccess = <
  S extends
    | FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>
    | FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>
>(
  id: string,
  onSuccess: (snapshot: S) => any
) => (snapshot: S) => any;

type HandleError = <Q extends FirestoreQuery>(
  id: string,
  query: Q,
  onSuccess: (QuerySnapshot: FirestoreSnapshot<Q>) => any,
  onError?: (error: Error) => any
) => (error: Error) => any;

type AddListener = <Q extends FirestoreQuery>(
  id: string,
  query: Q,
  onSuccess: (QuerySnapshot: FirestoreSnapshot<Q>) => any,
  onError?: (error: Error) => any
) => void;
