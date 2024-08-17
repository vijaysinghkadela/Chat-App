import React, { useRef } from "react";
import AppLayout from "../components/layout/AppLayout";
import { IconButton, Skeleton, Stack } from "@mui/material";
import { grayColor, orange } from "../constants/color.js";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { InputBox } from "../components/Styles/StyledComponents.jsx";
import FileMenu from "../components/dialogs/FileMenu.jsx";
import { sampleMessages } from "../constants/sampleData.js";
import MessageComponents from "../components/shared/MessageComponents.jsx";
import { getSocket } from "../socket.jsx";
import { NEW_MESSAGE } from "../constants/events.js";
import { useChatDetailsQuery } from "../redux/api/api.js";
const user = {
  _id: "asdasd",
  name: "User",
};

const Chat = ({ chatId }) => {
  const containerRef = useRef(null);

  const socket = getSocket();

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });

  const [message, setMessage] = useState("");
  const members = chatDetails?.data?.chat?.members;

  const submitHandler = (e) => {
    e.preventDefalut();
    if (!message.trim()) return;

    // Emitting the message to the server.
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };



  useEffect(() => {
    socket.on(NEW_MESSAGE, (data) => {
      
    });
  });





  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
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
        onsubmit={submitHandler}
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

          <InputBox
            placeholder="type Message Here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

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
