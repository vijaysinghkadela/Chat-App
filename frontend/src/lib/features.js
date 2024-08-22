import moment from "moment";

const fileFormat = (url = "") => {
  const fileExtention = url.split(".").pop();

  if (
    fileExtention === "mp4" ||
    fileExtention === "webm" ||
    fileExtention === "ogg"
  )
    return "video";

  if (fileExtention === "mp3" || fileExtention === "wav") return "audio";

  if (
    fileExtention === "png" ||
    fileExtention === "jpg" ||
    fileExtention === "jpeg" ||
    fileExtention === "gif"
  )
    return "image";

  return "file";
};

const transfromImage = (url = "", width = 100) => {
  const newUrl = url.replace("upload/", `upload/dpr_auto/w_${width}/`);
  return newUrl;
};

const getLast7Days = () => {
  const currentDate = moment();

  const last7Days = [];

  for (let i = 0; i < 7; i++) {
    const dayDate = currentDate.clone().subtract(i, "days");
    const dayName = dayDate.format("dddd");

    return last7Days.unshift(dayName);
  }
};

const getOrSaveFromStorage = ({ key, value, get }) => {
  if (get)
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : nuil;
  else localStorage.setItem(key, JSON.stringify(value));
};

export { fileFormat, getLast7Days, transfromImage, getOrSaveFromStorage };
