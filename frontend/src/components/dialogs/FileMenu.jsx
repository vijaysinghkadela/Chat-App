import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsFileMenu } from "../../redux/reducers/misc";
import {
  AudioFile as AudioFileIcon,
  Image as ImageIcon,
  UploadFile as UploadFileIcon,
  VideoFile as VideoFileIcon,
} from "@mui/icons-material";

const FileMenu = ({ anchopE1 }) => {
  const { isFileMenu } = useSelector((select) => state.misc);
  const dispatch = useDispatch();
  const CloseFileMenu = () => dispatch(setIsFileMenu(false));
  const selectRef = (ref) => {
    ref.current.click();
  };
  const fileChangeHandler = (e, key) => {};
  return (
    <Menu anchorEl={anchopE1} open={isFileMenu} onClose={CloseFileMenu}>
      <div
        style={{
          width: "10rem",
        }}
      >
        <MenuList>
          <MenuItem onClick={()=> selectRef()}>
            <Tooltip title="Image">
              <ImageIcon />
            </Tooltip>
            <ListItemText
              style={{
                marginLeft: "0.5rem",
              }}
            >
              Image
            </ListItemText>
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg, image/gif"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Images")}
            />
          </MenuItem>

          <MenuItem>
            <Tooltip title="Audio">
              <AudioFileIcon />
            </Tooltip>
            <ListItemText
              style={{
                marginLeft: "0.5rem",
              }}
            >
              Audio
            </ListItemText>
            <input
              type="file"
              multiple
              accept="audio/meg , audio/wav , audio/mp3"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Audios")}
            />
          </MenuItem>

          <MenuItem>
            <Tooltip title="Video">
              <VideoFileIcon />
            </Tooltip>
            <ListItemText
              style={{
                marginLeft: "0.5rem",
              }}
            >
              Video
            </ListItemText>
            <input
              type="file"
              multiple
              accept="*"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Files")}
            />
          </MenuItem>

          <MenuItem>
            <Tooltip title="File">
              <UploadFileIcon />
            </Tooltip>
            <ListItemText
              style={{
                marginLeft: "0.5rem",
              }}
            >
              File
            </ListItemText>
            <input
              type="file"
              multiple
              accept="video/mp4, video/webm , video/ogg"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Videos")}
            />
          </MenuItem>
        </MenuList>
      </div>
    </Menu>
  );
};

export default FileMenu;
