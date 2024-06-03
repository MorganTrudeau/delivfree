import React, { useContext } from "react";
import { PopoverContainer } from "../Popover/PopoverContainer";
import { PopoverListItem } from "../Popover/PopoverListItem";
import { Status } from "delivfree";
import { capitalize } from "app/utils/general";
import { Filter } from "../Filter";
import { PopoverContext } from "../Popover/PopoverContext";
import { ViewStyle } from "react-native";

type Props = {
  onFilterPress: (filter: Status) => void;
  activeFilter: Status | null | undefined;
  style?: ViewStyle;
};

export const StatusFilter = ({ onFilterPress, activeFilter, style }: Props) => {
  const popoverContext = useContext(PopoverContext);

  const handlePress = (filter: Status) => () => {
    popoverContext.dismissPopover();
    onFilterPress(filter);
  };

  const renderStatusPopover = () => {
    return (
      <PopoverContainer>
        <PopoverListItem
          text="Pending"
          onPress={handlePress("pending")}
          active={activeFilter === "pending"}
        />
        <PopoverListItem
          text="Approved"
          onPress={handlePress("approved")}
          active={activeFilter === "approved"}
        />
        <PopoverListItem
          text="Denied"
          onPress={handlePress("denied")}
          active={activeFilter === "denied"}
        />
      </PopoverContainer>
    );
  };

  return (
    <Filter
      filter="Status"
      value={activeFilter ? capitalize(activeFilter) : ""}
      renderPopover={renderStatusPopover}
      style={style}
    />
  );
};
