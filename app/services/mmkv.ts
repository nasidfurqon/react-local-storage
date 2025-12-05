let storage: any;
try {
  const { MMKV } = require("react-native-mmkv");
  storage = new MMKV();
} catch (e) {
  console.warn(
    "MMKV not available, using fallback storage:",
    (e as any)?.message || e
  );
  const map = new Map<string, string>();
  storage = {
    set: (key: string, value: any) =>
      map.set(key, typeof value === "string" ? value : JSON.stringify(value)),
    getString: (key: string) => (map.has(key) ? map.get(key) : undefined),
    getBoolean: (key: string) => {
      const v = map.get(key);
      if (v === undefined) return undefined;
      return v === "true" || v === "1";
    },
    delete: (key: string) => map.delete(key),
  };
}

export const saveLogin = (uid: string, email: string) => {
  storage.set("user", uid);
  storage.set("userEmail", email);
  storage.set("isLoggedIn", true);
};

export const getLogin = () => {
  return storage.getString("user");
};

export const getUserEmail = () => {
  return storage.getString("userEmail");
};

export const isLoggedIn = () => {
  return storage.getBoolean("isLoggedIn") ?? false;
};

export const logout = () => {
  storage.delete("user");
  storage.delete("userEmail");
  storage.delete("isLoggedIn");
};
