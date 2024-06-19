export const hasValidParams = (params: { [key: string]: any } = {}) => {
  return Object.entries(params).every(([key, val]) => val);
};
