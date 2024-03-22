import * as Location from "expo-location";
import { useAlert } from "./index";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { LocationPermission, usePermissions } from "./usePermissions";
import { errorHasCode } from "app/utils/general";

export const useGeoPosition = () => {
  const Alert = useAlert();

  const watchSubscription = useRef<Location.LocationSubscription>();

  const [findingLocation, setFindingLocation] = useState(false);

  const { canUse } = usePermissions();

  useEffect(() => {
    return () => {
      watchSubscription.current && watchSubscription.current.remove();
    };
  }, []);

  const watchLocation = async (
    callback: (data: {
      position: { latitude: number; longitude: number };
    }) => void,
    onError: (error: unknown) => void
  ) => {
    if (watchSubscription.current) {
      watchSubscription.current.remove();
    }

    const hasPermission = await canUse(LocationPermission);

    if (hasPermission) {
      try {
        watchSubscription.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Highest,
            distanceInterval: 50,
            timeInterval: 10000,
          },
          async (snapshot: Location.LocationObject) => {
            try {
              const {
                coords: { latitude, longitude },
              } = snapshot;
              const data = { position: { latitude, longitude } };
              callback(data);
            } catch (error) {
              onError(error);
              handleErrors(error);
            }
          }
        );
      } catch (error) {
        onError(error);
        handleErrors(error);
      }
    } else {
      onError("missing-permission");
      handlePermissionError();
    }
  };

  const getLocation = async (): Promise<{
    position: { latitude: number; longitude: number };
  } | null> => {
    const hasPermission = await canUse(LocationPermission);

    if (hasPermission) {
      try {
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });

        const {
          coords: { latitude, longitude },
        } = position;

        return { position: { latitude, longitude } };
      } catch (error) {
        return handleErrors(error);
      }
    } else {
      return null;
    }
  };

  const handleErrors = (error: unknown): null => {
    console.log("Location error", error);

    if (!errorHasCode(error)) {
      return onFailedLocationRequest();
    }

    if (Platform.OS === "ios") {
      switch (error.code) {
        case 1:
          return handlePermissionError();
        case 2:
          return onFailedLocationRequest();
        case 3:
          return onFailedLocationRequest();
        default:
          return onFailedLocationRequest();
      }
    } else {
      if (error.code === 5) {
        return handleLocationDisabledError();
      } else {
        return onFailedLocationRequest();
      }
    }
  };

  const handleLocationDisabledError = () => {
    Alert.alert(
      "Location Not Enabled",
      "Please enable Location in your phone settings and try again."
    );
    setFindingLocation(false);
    return null;
  };

  const handlePermissionError = () => {
    Alert.alert(
      "Insufficient Permissions",
      "Location permissions are required to find your location. Please allow DelivFree location access in your device settings."
    );
    setFindingLocation(false);
    return null;
  };

  const onFailedLocationRequest = () => {
    Alert.alert(
      "Location Unavailable",
      "Unable to retrieve location. Ensure GPS is enabled and connect to Wifi if available."
    );
    setFindingLocation(false);
    return null;
  };

  return { getLocation, findingLocation, watchLocation };
};
