import React, { forwardRef, useState } from "react";
import ReanimatedCenterModal from "../Modal/CenterModal";
import { ModalRef } from "app/utils/types";
import { ManageLicense, Props } from "./ManageLicense";
import { License, Status } from "delivfree";
import { approveLicense, denyLicense, updateLicense } from "app/apis/licenses";

export const LicenseDisplayModal = forwardRef<
  ModalRef,
  Omit<Props, "license" | "onChangeStatus"> & {
    license: License | null | undefined;
  }
>(function LicenseDisplayModal({ license, onChange, ...rest }, ref) {
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState<Status>();

  const handleChange = async (licenceId: string, update: Partial<License>) => {
    try {
      setLoading(true);
      await updateLicense(licenceId, update);
      onChange(licenceId, { ...license, ...update });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (
    licenceId: string,
    status: Status,
    statusMessage: string | null
  ) => {
    try {
      setStatusLoading(status);
      if (status === "approved") {
        await approveLicense(licenceId);
      } else {
        await denyLicense(licenceId, statusMessage);
      }
      onChange(licenceId, { ...license, status, statusMessage });
      setStatusLoading(undefined);
    } catch (error) {
      setStatusLoading(undefined);
    }
  };

  return (
    <ReanimatedCenterModal ref={ref}>
      {license && (
        <ManageLicense
          {...rest}
          license={license}
          onChange={handleChange}
          onChangeStatus={handleChangeStatus}
          loading={loading}
          statusLoading={statusLoading}
        />
      )}
    </ReanimatedCenterModal>
  );
});
