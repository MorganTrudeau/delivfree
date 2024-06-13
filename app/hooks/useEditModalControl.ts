import { BottomSheetRef } from "app/components/Modal/BottomSheet";
import { useCallback, useRef, useState } from "react";

export const useEditModalControl = <I, P>() => {
  const modalRef = useRef<BottomSheetRef>(null);
  const [parent, setParent] = useState<P | null>(null);
  const [itemEdit, setItemEdit] = useState<I | null>(null);

  const onAdd = useCallback((parent?: any) => {
    if (parent && !parent.nativeEvent) {
      setParent(parent);
    }
    modalRef.current?.snapToIndex(0);
  }, []);

  const onEdit = useCallback((newItem) => {
    setItemEdit(newItem);
    modalRef.current?.snapToIndex(0);
  }, []);

  const closeModal = useCallback(() => {
    modalRef.current?.close();
  }, []);

  const onModalClose = useCallback(() => {
    if (itemEdit) {
      setItemEdit(null);
    }
  }, [itemEdit]);

  return {
    modalRef,
    itemEdit,
    parent,
    onEdit,
    onAdd,
    closeModal,
    onModalClose,
  };
};
