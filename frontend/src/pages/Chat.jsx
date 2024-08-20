import { useInfiniteScrollTop } from "6pp";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { IconButton, Skeleton, Stack } from "@mui/material";
import React, { useCallback, useRef } from "react";
import { InputBox } from "../components/Styles/StyledComponents.jsx";
import FileMenu from "../components/dialogs/FileMenu.jsx";
import AppLayout from "../components/layout/AppLayout";
import MessageComponents from "../components/shared/MessageComponents.jsx";
import { grayColor, orange } from "../constants/color.js";
import { NEW_MESSAGE } from "../constants/events.js";
import { useErrors, useSocketEvent } from "../hooks/hook.jsx";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api.js";
import { getSocket } from "../socket.jsx";

const Chat = ({ chatId, user }) => {
  const containerRef = useRef(null);
  const socket = getSocket();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const errors = [
    { isError: chatDetails.isError, errors: chatDetails.error },
    { isError: oldMessagesChunk.isError, errors: oldMessagesChunk.error },
  ];
  const members = chatDetails?.data?.chat?.members;

  const submitHandler = (e) => {
    e.preventDefalut();
    if (!message.trim()) return;

    // Emitting the message to the server.
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  const newMessagesHandler = useCallback((data) => {
    setMessages((prev) => [...prev, data]);
  }, []);

  const newMessageHandler = useCallback((data) => {
    console.log(data);
  }, []);

  const eventHandler = { [NEW_MESSAGE]: newMessagesHandler };

  useSocketEvent(socket, eventHandler);

  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];

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
        {allMessages.map((i) => (
          <MessageComponents key={i._id} message={i} user={user} />
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
