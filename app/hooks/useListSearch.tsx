import React from "react";
import { Icon, TextField } from "app/components";
import { $paddingVerticalSm } from "app/components/styles";
import { colors, spacing } from "app/theme";
import { sizing } from "app/theme/sizing";
import { useCallback, useMemo, useState } from "react";
import { View, ViewStyle } from "react-native";

export const useListSearch = <V,>(
  data: V[],
  queryExtractor: (item: V) => string
) => {
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    const sorted = data.sort((a, b) =>
      queryExtractor(a)
        .trim()
        .toUpperCase()
        .localeCompare(queryExtractor(b).trim().toUpperCase())
    );
    return !search
      ? sorted
      : sorted.filter((i) =>
          queryExtractor(i).toUpperCase().startsWith(search.toUpperCase())
        );
  }, [search, data]);

  const renderSearchIcon = useCallback(
    () => (
      <Icon
        icon="magnify"
        size={sizing.md}
        style={$icon}
        color={colors.textDim}
      />
    ),
    []
  );

  const renderSearch = useCallback(
    () => (
      <View style={$paddingVerticalSm}>
        <TextField
          onChangeText={setSearch}
          placeholder="Search"
          LeftAccessory={renderSearchIcon}
        />
      </View>
    ),
    [renderSearchIcon]
  );

  return { renderSearch, filteredItems };
};

const $icon: ViewStyle = { marginHorizontal: spacing.xs };
