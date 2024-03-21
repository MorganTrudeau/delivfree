import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  InteractionManager,
  Pressable,
  PressableProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Icon, IconTypes } from "../Icon";
import { Badge, Ratings, User } from "smarticus";
import { useToast } from "app/hooks";
import { RootState, useAppDispatch, useAppSelector } from "app/redux/store";
import { sizing } from "app/theme/sizing";
import { Avatar } from "../Avatar";
import {
  $emptyText,
  $popover,
  $popoverIcon,
  $popoverItem,
  $popoverLoader,
  $row,
} from "../styles";
import { colors, spacing } from "app/theme";
import { BottomSheet, BottomSheetRef } from "./BottomSheet";
import { ReportModal } from "./ReportModal";
import { Text } from "../Text";
import { Username } from "../Username";
import { badges } from "app/utils/badges";
import { blockUser, unblockUser } from "app/apis/user";
import { Popover } from "../Popover";
import { UserProfileModalContext } from "app/context/UserProfileContext";
import firestore from "@react-native-firebase/firestore";
import { Placeholder } from "../Placeholder";
import { ButtonSmall } from "../ButtonSmall";
import { RatingsList } from "../Ratings/RatingsList";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../Button";
import { setBlockUserLoading } from "app/redux/reducers/user";
import { BadgeListItem } from "../Badges/BadgeListItem";

const HEADER_HEIGHT = 60;

export type UserOption = {
  icon: IconTypes;
  title: string;
  onPress: () => void;
  loading?: boolean;
};

type UserOptionsProps = {
  user: User;
  extraOptions?: UserOption[];
};

const UserProfile = ({ user }: UserOptionsProps) => {
  const popoverRef = useRef<{ dismiss: () => void } | null>(null);
  const reportModal = useRef<BottomSheetRef>(null);

  const insets = useSafeAreaInsets();

  const Toast = useToast();

  const badgeId = user.badgeId;

  const activeUser = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();

  const isBlocked = activeUser?.blocked?.includes(user.id);

  const [userBadges, setUserBadges] = useState<Badge[]>();
  const [userRatings, setUserRatings] = useState<
    Ratings["categories"] | null
  >();
  const [badgesError, setBadgesError] = useState(false);
  const [ratingsError, setRatingsError] = useState(false);

  const [filter, setFilter] = useState<"badges" | "ratings">("badges");

  const loadBadges = useCallback(async () => {
    try {
      console.log("Load badges");
      setBadgesError(false);
      const snapshot = await firestore()
        .collection("Users")
        .doc(user.id)
        .collection("Badges")
        .orderBy("collectedTimestamp", "desc")
        .get();
      const _userBadges = snapshot.docs.map((doc) => badges[doc.id] as Badge);
      setUserBadges(_userBadges);
    } catch (error) {
      setBadgesError(true);
    }
  }, [user.id]);

  const loadRatings = useCallback(async () => {
    try {
      console.log("Load ratings");
      setRatingsError(false);
      const snapshot = await firestore()
        .collection("Ratings")
        .doc(user.id)
        .get();
      const categoryRatings = snapshot.data() as Ratings;
      setUserRatings(categoryRatings?.categories || null);
    } catch (error) {
      setRatingsError(true);
    }
  }, [user.id]);

  useEffect(() => {
    if (filter === "badges") {
      if (!userBadges) {
        loadBadges();
      }
    } else {
      if (!userRatings) {
        loadRatings();
      }
    }
  }, [filter, loadBadges, loadRatings, userBadges, userRatings]);

  const renderPopover = () => {
    return (
      <View style={$popover}>
        <PopoverItem
          onPress={isBlocked ? handleUnblock : handleBlock}
          icon={"cancel"}
          title={isBlocked ? "Unblock" : "Block"}
          loadingSelector={(state: RootState) => state.user.blockLoading}
        />
        <PopoverItem onPress={handleReport} icon={"flag"} title={"Report"} />
      </View>
    );
  };

  const handleReport = () => {
    reportModal.current?.snapToIndex(0);
    popoverRef.current?.dismiss();
  };

  const handleUnblock = async () => {
    if (!activeUser) {
      return;
    }
    try {
      dispatch(setBlockUserLoading(true));
      await unblockUser(activeUser.id, user.id);
      Toast.show(`You unblocked ${user.username}`);
      dispatch(setBlockUserLoading(false));
      popoverRef.current?.dismiss();
    } catch (error) {
      dispatch(setBlockUserLoading(false));
      console.log("Canceled");
    }
  };

  const handleBlock = async () => {
    if (!activeUser) {
      return;
    }
    try {
      await new Promise<void>((resolve, reject) => {
        Alert.alert(
          "Block this user",
          `Are you sure you want to block ${user.username}?`,
          [
            { text: "No", onPress: reject },
            { text: "Yes", onPress: () => resolve() },
          ]
        );
      });
      dispatch(setBlockUserLoading(true));
      await blockUser(activeUser.id, user.id);
      Toast.show(`You blocked ${user.username}`);
      dispatch(setBlockUserLoading(false));
      popoverRef.current?.dismiss();
    } catch (error) {
      dispatch(setBlockUserLoading(false));
      console.log("Canceled");
    }
  };

  return (
    <View>
      <View
        style={[
          $row,
          $header,
          {
            backgroundColor: user.color || colors.surface,
            paddingLeft: insets.left + spacing.md,
            paddingRight: insets.right + spacing.md,
          },
        ]}
      >
        {user.id !== activeUser?.id && (
          <Popover
            renderPopover={renderPopover}
            position={"topRight"}
            ref={popoverRef}
          >
            <Icon
              icon={"dots-horizontal"}
              size={sizing.md}
              containerStyle={$popoverIconContainer}
            />
          </Popover>
        )}
      </View>

      <View
        style={[
          $userContainer,
          {
            paddingLeft: insets.left + spacing.md,
            paddingRight: insets.right + spacing.md,
            paddingBottom: insets.bottom + spacing.md,
          },
        ]}
      >
        <View style={$avatarContainer}>
          <Avatar user={user} size={HEADER_HEIGHT} />
        </View>
        <Username
          textProps={{ size: "xl", preset: "subheading" }}
          user={user}
        />
        {!!badgeId && <Text style={$badgeTitle}>{badges[badgeId].title}</Text>}

        <View style={$filterRow}>
          <ButtonSmall
            onPress={() => setFilter("badges")}
            text={"Badge collection"}
            preset={filter === "badges" ? "reversed" : "default"}
            style={$badgesFilter}
          />
          <ButtonSmall
            onPress={() => setFilter("ratings")}
            text={"Ratings"}
            preset={filter === "ratings" ? "reversed" : "default"}
          />
        </View>

        {filter === "badges" &&
          (badgesError ? (
            <Button text="Reload badges" onPress={loadBadges} />
          ) : (
            <Placeholder
              loaded={userBadges !== undefined}
              LoadingComponent={
                <ActivityIndicator color={colors.primary} style={$loader} />
              }
            >
              {!userBadges?.length && (
                <Text style={$emptyText}>
                  {`${
                    user.id === activeUser?.id
                      ? "You have"
                      : user.username + " has"
                  } no badges`}
                </Text>
              )}
              {userBadges?.map((badge) => (
                <BadgeListItem key={badge.id} badge={badge} />
              ))}
            </Placeholder>
          ))}

        {filter === "ratings" &&
          (ratingsError ? (
            <Button text="Reload ratings" onPress={loadRatings} />
          ) : (
            <Placeholder
              loaded={userRatings !== undefined}
              LoadingComponent={
                <ActivityIndicator color={colors.primary} style={$loader} />
              }
            >
              <RatingsList
                scrollEnabled={false}
                ratings={userRatings}
                emptyMessage={
                  user.id !== activeUser?.id
                    ? `${user.username} has no ratings`
                    : undefined
                }
              />
            </Placeholder>
          ))}
      </View>

      <ReportModal ref={reportModal} />
    </View>
  );
};

type PopoverItemProps = {
  icon: IconTypes;
  title: string;
  loadingSelector?: (state: RootState) => boolean;
  onPress: () => void;
  destructive?: boolean;
};

const defaultLoadingSelector = () => false;

const PopoverItem = ({
  icon,
  title,
  loadingSelector = defaultLoadingSelector,
  onPress,
  destructive,
}: PopoverItemProps) => {
  const loading = useAppSelector(loadingSelector);

  return (
    <TouchableOpacity onPress={onPress} style={$popoverItem}>
      <View style={$row}>
        <Icon
          icon={icon}
          size={sizing.lg}
          color={destructive ? colors.primary : undefined}
          containerStyle={$popoverIcon}
        />
        <Text>{title}</Text>
      </View>
      <View style={$popoverLoader}>
        {loading && <ActivityIndicator color={colors.primary} />}
      </View>
    </TouchableOpacity>
  );
};

export const UserProfileControl = ({
  user,
  disabled,
  ...rest
}: Omit<PressableProps, "onPress"> & {
  user: User | null | undefined;
}) => {
  const userProfileModalContext = useContext(UserProfileModalContext);

  const onPress = () => {
    if (user) {
      userProfileModalContext.showProfile(user);
    }
  };

  return (
    <Pressable
      {...rest}
      onPress={onPress}
      disabled={disabled || !userProfileModalContext.showProfile}
    />
  );
};

type UserProfileModalProps = Omit<UserOptionsProps, "user">;
export type UserProfileModalRef = {
  open: (user: User) => void;
  close: () => void;
};

const snapPoints = ["40%", "92%"];

export const UserProfileModal = forwardRef<
  UserProfileModalRef,
  UserProfileModalProps
>(function UserProfileModal(props, ref) {
  const bottomSheet = useRef<BottomSheetRef>(null);

  const [user, setUser] = useState<User>();

  const open = (_user: User) => {
    setUser(_user);
    InteractionManager.runAfterInteractions(() => {
      bottomSheet.current?.snapToIndex(0);
    });
  };

  const close = () => {
    bottomSheet.current?.snapToIndex(-1);
  };

  const handleClose = useCallback(() => {
    setUser(undefined);
  }, []);

  useImperativeHandle(ref, () => ({ open, close }));

  return (
    <BottomSheet
      ref={bottomSheet}
      snapPoints={snapPoints}
      onClose={handleClose}
      handleStyle={{
        ...$handle,
        backgroundColor: user ? user?.color || colors.surface : undefined,
      }}
    >
      <BottomSheetScrollView>
        {user && <UserProfile {...props} user={user} />}
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

const $header: ViewStyle = {
  height: HEADER_HEIGHT,
  backgroundColor: colors.surface,
  justifyContent: "flex-end",
  paddingHorizontal: spacing.md,
};

const $handle: ViewStyle = {
  borderTopRightRadius: 15,
  borderTopLeftRadius: 15,
};

const $badgeTitle: TextStyle = {
  marginTop: spacing.xxs,
};

const $avatarContainer: ViewStyle = {
  padding: 6,
  borderRadius: 100,
  marginTop: -HEADER_HEIGHT + spacing.sm + 10,
  marginBottom: 2,
  backgroundColor: colors.background,
  alignSelf: "flex-start",
};

const $userContainer: ViewStyle = { padding: spacing.md, paddingTop: 0 };

const $popoverIconContainer: ViewStyle = {
  padding: spacing.xxs,
  backgroundColor: colors.underlay,
  borderRadius: 1000,
};

const $loader: ViewStyle = { padding: spacing.md };

const $badgesFilter: ViewStyle = {
  marginEnd: spacing.xs,
};

const $filterRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: spacing.md,
  marginTop: spacing.md,
};
