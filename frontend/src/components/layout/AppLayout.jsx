import React from "react";
import Hander from "./Hander";
import Title from "../shared/Title.jsx";
import { Grid } from "@mui/material";
import ChatList from "../Specific/ChatList.jsx";
import { sampleChats } from "../../constants/sampleData.js";
import { useParams } from "react-router-dom";
import Profile from "../Specific/Profile.jsx";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const chatId = params.chatId;

    const handleDeleteChat = (event, _id, groupChat) => {
      event.preventDefault();
      console.log("Deleting chat with id: ", _id, " groupChat: ", groupChat);
    };

    return (
      <>
        <Title />
        <Hander />

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
            <ChatList
              chats={sampleChats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
            />
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
