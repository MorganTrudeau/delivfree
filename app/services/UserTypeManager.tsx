import { setUserType } from "app/redux/reducers/appConfig";
import { useAppDispatch, useAppSelector } from "app/redux/store";
import { getAppType } from "app/utils/general";
import { useEffect } from "react";
import { shallowEqual } from "react-redux";

export const UserTypeManager = () => {
  const { user, userType } = useAppSelector(
    (state) => ({
      user: state.user.user,
      userType: state.appConfig.userType,
    }),
    shallowEqual
  );
  const dispatch = useAppDispatch();

  const userDriver = !!user?.driver;
  const userVendor = !!user?.vendor;

  useEffect(() => {
    let newUserType: typeof userType;

    const appType = getAppType();

    if (appType === "CONSUMER") {
      newUserType = "consumer";
    } else if (appType === "ADMIN") {
      newUserType = "admin";
    } else if (appType === "VENDOR") {
      if (userDriver) {
        newUserType = "driver";
      } else if (userVendor) {
        newUserType = "vendor";
      }
    }

    if (newUserType !== userType) {
      dispatch(setUserType(newUserType));
    }
  }, [userDriver, userVendor, userType]);

  return null;
};
