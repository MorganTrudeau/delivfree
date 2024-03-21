import { useToast } from "./useToast";
import { useEffect, useRef, useState } from "react";
import { useAlert } from "./useAlert";
import firestore from "@react-native-firebase/firestore";
import { MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH, User } from "smarticus";
import { useThrottle } from "./useThrottle";

export const isValidUsername = (username: string) => {
  const len = username.length;
  return len >= MIN_USERNAME_LENGTH && len <= MAX_USERNAME_LENGTH;
};

export const searchUserByUsername = async (term: string): Promise<User[]> => {
  const upperCaseTerm = term.toUpperCase();

  const usersSnapshot = await firestore()
    .collection("Users")
    .where("usernameUpperCase", "==", upperCaseTerm)
    .get();

  const users: User[] = [];

  usersSnapshot.forEach((doc) => {
    const user = doc.data() as User;
    if (user) {
      users.push(user);
    }
  });

  return users;
};

export const useEditUsername = (
  currentUsername: string | undefined,
  username: string,
  setUsername: (username: string) => void
) => {
  const Toast = useToast();
  const throttle = useThrottle();
  const usernameCheckLoadingRef = useRef(false);
  const [usernameUnavailable, setUsernameUnavailable] = useState(false);
  const [checkingAvailability, setCheckingAvailablility] = useState(false);
  const Alert = useAlert();

  useEffect(() => {
    const _username = username.trim().toUpperCase();
    if (
      _username &&
      (!currentUsername || _username !== currentUsername.toUpperCase())
    ) {
      if (usernameUnavailable) {
        setUsernameUnavailable(false);
      }
      usernameCheckLoadingRef.current = true;
      throttle(() => checkUsernameAvailability(_username), 300);
    } else if (usernameUnavailable) {
      setUsernameUnavailable(false);
    }
  }, [username, currentUsername]);

  const checkUsernameAvailability = async (username: string) => {
    try {
      setCheckingAvailablility(true);
      const users = await searchUserByUsername(username);
      if (users.length) {
        setUsernameUnavailable(true);
      } else if (usernameUnavailable) {
        setUsernameUnavailable(false);
      }
      setCheckingAvailablility(false);
      usernameCheckLoadingRef.current = false;
    } catch (error) {
      console.log(error);
      setCheckingAvailablility(false);
      usernameCheckLoadingRef.current = false;
    }
  };

  const validateUsernameUpdate = (newUsername: string) => {
    if (!isValidUsername(newUsername)) {
      return Alert.alert(
        "Invalid username",
        "Username must be 3 or more characters long."
      );
    }
    if (usernameCheckLoadingRef.current) {
      return Toast.show("Checking username availability...", 1000);
    }
    if (usernameUnavailable) {
      return Alert.alert(
        "Username unavailable",
        "Another user already has this username."
      );
    }
    return true;
  };

  return {
    onUsernameChanged: setUsername,
    validateUsernameUpdate,
    usernameUnavailable,
    checkingAvailability,
  };
};
