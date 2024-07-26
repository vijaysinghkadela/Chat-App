import React, { memo } from "react";
import { Link } from "../Styles/StyledComponents";
import { Box, Stack, Typography } from "@mui/material";
import AvatarCard from "./AvatarCard";

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {
  return (
    <Link
    sx={{
      padding: "0"
    }}
      to={`/chat/${_id}`}
      onContextMenu={(event) => handleDeleteChat(event, _id, groupChat)}
    >
      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
          cursor: "pointer",
          color: sameSender ? "white" : "unset",
          backgroundColor: sameSender ? "black" : "unset",
          position: "relative",
        }}
      >
        <AvatarCard avatar={avatar} />
        

        <Stack>
          <typegraphy>{name}</typegraphy>
          {newMessageAlert && (
            <Typography>{newMessageAlert.count} New Message</Typography>
          )}
        </Stack>

        {isOnline && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              right: "1rem",
              borderRadius: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "green",
              color: "white",
              borderRadius: "50%",
              width: "1rem",
              height: "1rem",
            }}
          />
        )}
      </div>
    </Link>
  );
};

export default memo(ChatItem);
