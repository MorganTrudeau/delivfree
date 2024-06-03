import { Screen } from "app/components";
import { Drawer } from "app/components/Drawer";
import { PositionsList } from "app/components/Positions/PositionsList";
import { PositionsSelectModal } from "app/components/Positions/PositionsSelectModal";
import { ScreenHeader } from "app/components/ScreenHeader";
import { $containerPadding, $screen } from "app/components/styles";
import { AppStackScreenProps } from "app/navigators";
import { useAppSelector } from "app/redux/store";
import { ModalRef, Positions } from "delivfree";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { shallowEqual } from "react-redux";

interface VendorPositionsScreenProps extends AppStackScreenProps<"Positions"> {}

export const VendorPositionsScreen = (props: VendorPositionsScreenProps) => {
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

  return (
    <Drawer navigation={props.navigation}>
      <Screen
        preset="fixed"
        style={$screen}
        contentContainerStyle={$containerPadding}
        inDrawer
      >
        <ScreenHeader title="Positions" />
        <PositionsList
          positions={positionsList}
          vendorLocations={vendorLocations}
          onPress={handlePositionsPress}
        />
        <PositionsSelectModal ref={positionsModal} positions={editPositions} />
      </Screen>
    </Drawer>
  );
};
