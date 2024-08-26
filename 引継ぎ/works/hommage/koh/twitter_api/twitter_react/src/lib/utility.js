import Cookies from "js-cookie";

export const createDefaultHeaders = () => {
  return {
    "access-token": Cookies.get("_access_token"),
    client: Cookies.get("_client"),
    uid: Cookies.get("_uid"),
  };
};

export const formatDate = (date) => {
  const formatOptions = {
    dateStyle: "long",
    timeZone: "Asia/Tokyo",
  };
  const dateFormatter = new Intl.DateTimeFormat("ja-JP", formatOptions);
  return dateFormatter.format(date);
};

export const formatDateTime = (date) => {
  const formatOptions = {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Tokyo",
  };
  const dateFormatter = new Intl.DateTimeFormat("ja-JP", formatOptions);
  return dateFormatter.format(date);
};
