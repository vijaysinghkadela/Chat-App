import { Drawer, Grid, Skeleton } from "@mui/material";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
} from "../../../../Backend/constants/Events.js";
import { useErrors } from "../../hooks/hook.jsx";
import { useSocketEvents } from "../../hooks/useSocketEvents.js";
import { useMyChatsQuery } from "../../redux/api/api.js";
import { setIsMobile } from "../../redux/reducers/misc.js";
import { newMessagesHandler } from "../../socket.js";
import { getSocket } from "../../socket.jsx";
import Title from "../shared/Title.jsx";
import ChatList from "../Specific/ChatList.jsx";
import Profile from "../Specific/Profile.jsx";
import Header from "./Header.jsx";
import { NEW_REQUEST } from "../../constants/events.js";
import {
  incrementNotification,
  setNewMessagesAlert,
} from "../../redux/reducers/chat.js";
import { getOrSaveFromStorage } from "../../lib/features.js";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const dispatch = useDispatch();
    const chatId = params.chatId;

    const socket = getSocket();

    const { isMobile } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);
    const { newMessagesAlert } = useSelector((state) => state.auth);

    const { isLoading, data, isError, error } = useMyChatsQuery("");

    useErrors([{ isError, error }]);

    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
    }, [newMessagesAlert]);

    const handleDeleteChat = (event, _id, groupChat) => {
      event.preventDefault();
      console.log("Deleting chat with id: ", _id, " groupChat: ", groupChat);
    };

    const handleMobileClose = () => dispatch(setIsMobile(false));

    const newMessageAlertHandler = useCallback(
      (data) => {
        if (data.chatId === chatId) return;

        dispatch(setNewMessagesAlert(data));
      },
      [chatId]
    );

    const newRequestHandler = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertHandler,
      [NEW_REQUEST]: newMessageAlertHandler,
    };
    useSocketEvents(socket, eventHandlers);

    return (
      <>
        <Title />
        <Header />
        {isLoading ? (
          <Skeleton />
        ) : (
          <Drawer open={isMobile} onClose={handleMobileClose}>
            <ChatList
              width="70vw"
              chats={data?.chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              newMessagesAlert={newMessagesAlert}
            />
          </Drawer>
        )}

        <Grid container height={"calc(100vh - 4rem )"}>
          <Grid
            item
            sm={4}
            md={3}
            sx={{
              display: { xs: "none", sm: "block" },
            }}
            height={"100%"}
          >
            {isLoading ? (
              <Skeleton />
            ) : (
              <ChatList
                chats={data?.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessagesAlert}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
            <WrappedComponent
              {...props}
              socket={socket}
              chatId={chatId}
              user={user}
            />
          </Grid>

          <Grid
            item
            md={4}
            lg={3}
            height={"100%"}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem",
              bgcolor: "rgba(0, 0, 0, 0.85)",
            }}
          >
            <Profile user={user} />
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
