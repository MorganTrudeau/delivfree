import { Screen } from "app/components";
import { PositionsList } from "app/components/Positions/PositionsList";
import { PositionsSelectModal } from "app/components/Positions/PositionsSelectModal";
import { ScreenHeader } from "app/components/ScreenHeader";
import { $containerPadding, $screen } from "app/components/styles";
import { AppStackScreenProps } from "app/navigators";
import { useAppSelector } from "app/redux/store";
import { spacing } from "app/theme";
import { ModalRef, Positions } from "delivfree";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { shallowEqual } from "react-redux";

interface VendorPositionsScreenProps extends AppStackScreenProps<"Positions"> {}

export const VendorPositionsScreen = (props: VendorPositionsScreenProps) => {
  const insets = useSafeAreaInsets();

  const contentContainerStyle = useMemo(
    () => ({
      paddingBottom: spacing.md + insets.bottom,
      flexGrow: 1,
    }),
    [insets.bottom]
  );

  const positionsModal = useRef<ModalRef>(null);

  const { vendorLocations, positions } = useAppSelector(
    (state) => ({
      vendorLocations: state.vendorLocations.data,
      positions: state.positions.data,
    }),
    shallowEqual
  );
  const positionsList = useMemo(() => Object.values(positions), [positions]);

  const [editPositions, setEditPositions] = useState<Positions>();

  const handlePositionsPress = useCallback((positions: Positions) => {
    setEditPositions(positions);
    positionsModal.current?.open();
  }, []);

  const closePositionsModal = useCallback(() => {
    positionsModal.current?.close();
  }, []);

  const renderHeader = useCallback(
    () => <ScreenHeader title="Positions" />,
    []
  );

  return (
    <Screen
      preset="fixed"
      style={$screen}
      contentContainerStyle={$containerPadding}
    >
      <PositionsList
        positions={positionsList}
        vendorLocations={vendorLocations}
        onPress={handlePositionsPress}
        contentContainerStyle={contentContainerStyle}
        ListHeaderComponent={renderHeader}
      />
      <PositionsSelectModal
        ref={positionsModal}
        positions={editPositions}
        onClose={closePositionsModal}
      />
    </Screen>
  );
};
