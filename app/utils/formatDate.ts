import moment from "moment";

export const formatDate = (date: string, dateFormat?: string) => {
  return moment(date).format(dateFormat ?? "MMM dd, yyyy");
};
