import { License } from "delivfree";

export const getTotalPositions = (licenses: License[]) => {
  return licenses.reduce(
    (acc, license) => ({
      fullTime: acc.fullTime + license.fullTimePositions,
      partTime: acc.partTime + license.partTimePositions,
    }),
    { fullTime: 0, partTime: 0 }
  );
};
