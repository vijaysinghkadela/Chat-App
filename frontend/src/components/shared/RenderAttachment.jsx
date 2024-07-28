import React from "react";
import { transfromImage } from "../../lib/features";
import { FileOpen as FileOpenIcon } from "@mui/icons-material";

const RenderAttachment = (file, url) => {
  switch (file) {
    case "video":
      return <video src={url} preload="none" width={"200px"} controts />;

    case "image":
      return (
        <img
          src={transfromImage(url, 200)}
          alt="Attachement"
          width={"200px "}
          height={"150px"}
          style={{
            objectFit: "cantain",
          }}
        />
      );

    case "audio":
      return <audio src={url} preload="none" controts />;

    default:
      <FileOpenIcon />;
  }
};

export default RenderAttachment;
