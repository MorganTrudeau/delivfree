import { FC } from "react";
import { Sizes, BadgeIds } from "./enums";
import { PowerUp } from "./trivia";

export type User = {
  id: string;
  username: string;
  usernameUpperCase: string;
  keywords: string[];
  avatar?: string;
  avatarRef?: string;
  color: string;
  latestAppVersion: string;
  session?: string;
  badgeId?: BadgeId | null;
  claimedSignUpReward: boolean;
  created: number;
  blocked: string[];
};

export type ModalRef = {
  open: () => void;
  close: () => void;
  isOpen: () => boolean;
};

export type BottomSheetModalRef = {
  open: () => void;
  close: () => void;
};

export type Size = (typeof Sizes)[keyof typeof Sizes];

export type PowerUpQuantities = { [Property in PowerUp]: { quantity: number } };

export type AppConfig = {
  skipAdCoins: number;
  adFrequencySeconds: number;
  gamesBeforeAd: number;
  gamesBeforeAdResetFrequencySeconds: number;
};

export type BadgeId = (typeof BadgeIds)[keyof typeof BadgeIds];
export type Badge = {
  id: BadgeId;
  title: string;
  description: string;
  achieveMessage: string;
  shareMessage: string;
  coins: number;
  Icon: FC<any>;
};
export type UserBadge = {
  acknowledged: boolean;
  badgeId: BadgeId;
  collected: boolean;
  achieved: boolean;
  achievedTimestamp: number | null;
  collectedTimestamp: number | null;
};

export * from "./trivia";
export * from "./components";
export * from "./enums";
export * from "./constants";
export * from "./triviaApi";
