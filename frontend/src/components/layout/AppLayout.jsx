import React from "react";
import Header from "./Header.jsx";
import Title from "../shared/Title.jsx";
import { Drawer, Grid, Skeleton } from "@mui/material";
import ChatList from "../Specific/ChatList.jsx";
import { sampleChats } from "../../constants/sampleData.js";
import { useParams } from "react-router-dom";
import Profile from "../Specific/Profile.jsx";
import { useMyChatsQuery } from "../../redux/api/api.js";
import { useDispatch, useSelector } from "react-redux";
import { setIsMobile } from "../../redux/reducers/misc.js";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const despatch = useDispatch();
    const chatId = params.chatId;

    const { isMobile } = useSelector((state) => state.misc);

    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");

    const handleDeleteChat = (event, _id, groupChat) => {
      event.preventDefault();
      console.log("Deleting chat with id: ", _id, " groupChat: ", groupChat);
    };

    const handleMobileClose = () => despatch(setIsMobile(false));

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
              />
            )}
          </Grid>
          <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
            <WrappedComponent {...props} />
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
            <Profile />
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
