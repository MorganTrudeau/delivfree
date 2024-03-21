import { generateUid } from "../app/utils/general";

const updateObject = (
  object: { [key: string]: any },
  keys: string[],
  updater: (def: any) => any
): void => {
  if (keys.length === 1) {
    return (object[keys[0]] = updater(object[keys[0]]));
  } else {
    object[keys[0]] = object[keys[0]] || {};
    return updateObject(object[keys[0]], keys.slice(1), updater);
  }
};

class Doc {
  id: string;
  private val: { [key: string]: any };

  constructor(id: string, val?: any) {
    this.id = id;
    this.val = val;
  }

  data() {
    return this.val;
  }

  async update(val: { [key: string]: any }) {
    Object.entries(val).forEach(([key, val]) => {
      if (key.includes(".")) {
        const keys = key.split(".");
        updateObject(this.val, keys, () => val);
      } else {
        this.val[key] = val;
      }
    });
  }

  async set(val: { [key: string]: any }, options?: { merge: boolean }) {
    if (options?.merge) {
      return this.update(val);
    } else {
      this.val = val;
    }
  }
}

class Collection {
  private docs: { [key: string]: Doc } = {};

  async get() {
    return { docs: Object.values(this.docs) };
  }

  doc(key?: string) {
    const id = key || generateUid();
    if (!this.docs[id]) {
      this.docs[id] = new Doc(id);
    }
    return this.docs[id];
  }
}

class Database {
  data: { [collection: string]: Collection } = {};

  find(collection: string) {
    if (!this.data[collection]) {
      this.data[collection] = new Collection();
    }

    return this.data[collection];
  }
}

const database = new Database();

const firestore = () => {
  return {
    collection: (name: string) => {
      return database.find(name);
    },
  };
};

export default firestore;
