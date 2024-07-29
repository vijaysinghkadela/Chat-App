import React, { useRef } from "react";
import AppLayout from "../components/layout/AppLayout";
import { IconButton, Stack } from "@mui/material";
import { grayColor, orange } from "../constants/color.js";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { InputBox } from "../components/Styles/StyledComponents.jsx";
import FileMenu from "../components/dialogs/FileMenu.jsx";
import { sampleMessages } from "../constants/sampleData.js";
import MessageComponents from "../components/shared/MessageComponents.jsx";

const user = {
  _id: "asdasd",
  name: "User",
};

const Chat = () => {
  const containerRef = useRef(null);

  return (
    <>
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={grayColor}
        height={"90%"}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {sampleMessages.map((message, index) => (
          <MessageComponents key={index} message={index} user={user} />
        ))}
      </Stack>

      <form
        style={{
          height: "10%",
        }}
      >
        <Stack
          direction={"row"}
          height={"100%"}
          padding={"1rem"}
          alignItems={"center"}
          position={"relative"}
        >
          <IconButton
            sx={{
              position: "absolute",
              left: "1.5rem",
              rotate: "-30deg",
            }}
            ref={FileMenu}
          >
            <AttachFileIcon />
          </IconButton>

          <InputBox placeholder="type Message Here..." />

          <IconButton
            type="submit"
            sx={{
              rotate: "-30deg",
              bgcolor: orange,
              color: "white",
              marginLeft: "1rem",
              padding: "0.5rem",
              "&:hover": {
                bgcolor: "error.dark",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>

      <FileMenu />
    </>
  );
};

export default AppLayout()(Chat);
