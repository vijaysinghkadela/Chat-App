import React, { useState } from "react";
import {
  Avatar,
  Button,
  Container,
  createTheme,
  IconButton,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import { Typography } from "@mui/material";
import { blue, red  } from "@mui/material/colors";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import { VisuallyHiddenInput } from "../components/Styles/StyledComponents";
import { useFileHandler, useInputValidation, useStrongPassword } from "6pp";
import { usernameValidator } from "../utils/validators";
import { bgGradient } from "../constants/color";

const theme = createTheme({
  palette: {
    primary: blue,
    secondary: red,
  },
});

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleLogin = () => setIsLogin((prev) => !prev);

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useStrongPassword("");

  const avater = useFileHandler("single");

  const handleLogin = (e) => {
    e.preventDefault();
  };

  const handleSignUp = (e) => {
    e.preventDefault();
  };

  return (
    <div 
    
      style={{
         backgroundImage:
          bgGradient,
      }}
    >
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {isLogin ? (
            <>
              <typegraphy variant="h5">Login</typegraphy>
              <form
                action=""
                style={{
                  width: "100%",
                }}
                onSubmit={handleLogin}
              >
                <TextField
                  sx={{
                    marginTop: "1rem",
                  }}
                  required
                  fullWidth
                  label="username"
                  margin="normel"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                />

                <TextField
                  sx={{
                    marginTop: "1rem",
                  }}
                  required
                  fullWidth
                  label="password"
                  type="password"
                  margin="normel"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                />

                <Button
                  sx={{ mt: "1rem" }}
                  variant="contaiend"
                  color={theme.palette.primary.main}
                  type="submit"
                  fullWidth
                >
                  Login
                </Button>

                <Typography textAlign="center" m={"1rem"}>
                  OR
                </Typography>

                <Button
                  variant="text"
                  type="submit"
                  onClick={toggleLogin}
                  fullWidth
                  t
                >
                  Sign Up Instead
                </Button>
              </form>
            </>
          ) : (
            <>
              <typegraphy variant="h5">Sign Up</typegraphy>
              <form
                action=""
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleSignUp}
              >
                <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                  <Avatar
                    sx={{
                      width: "10rem",
                      height: "10rem",
                      objectFit: "contain",
                    }}
                    src={avater.preview}
                  />

                  {avater.error && (
                    <Typography
                      m={"1rem auto"}
                      width={"fit-content"}
                      display={"black"}
                      color="error"
                      variant="caption"
                    >
                      {avater.error}
                    </Typography>
                  )}

                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      color: "white",
                      bgcolor: "rgba(0,0,0,0.5)",
                      ":hover": {
                        bgcolor: "rgba(0,0,0,0.7)",
                      },
                    }}
                    component="label"
                  >
                    <>
                      <CameraAltIcon />
                      <VisuallyHiddenInput
                        type="file"
                        onChange={avater.changeHandler}
                      />
                    </>
                  </IconButton>
                </Stack>

                <TextField
                  sx={{
                    marginTop: "1rem",
                  }}
                  required
                  fullWidth
                  label="Name"
                  margin="normel"
                  variant="outlined"
                  value={name.value}
                  onChange={name.changeHandler}
                />

                <TextField
                  sx={{
                    marginTop: "1rem",
                  }}
                  required
                  fullWidth
                  label="Bio"
                  margin="normel"
                  variant="outlined"
                  value={bio.value}
                  onChange={bio.changeHandler}
                />

                <TextField
                  sx={{
                    marginTop: "1rem",
                  }}
                  required
                  fullWidth
                  label="username"
                  margin="normel"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                />

                {username.error && (
                  <Typography color="error" variant="caption">
                    {username.error}
                  </Typography>
                )}

                <TextField
                  sx={{
                    marginTop: "1rem",
                  }}
                  required
                  fullWidth
                  label="password"
                  type="password"
                  margin="normel"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                />

                {password.error && (
                  <Typography color="error" variant="caption">
                    {password.error}
                  </Typography>
                )}

                <Button
                  sx={{ mt: "1rem" }}
                  variant="contaiend"
                  color={theme.palette.primary.main}
                  type="submit"
                  fullWidth
                >
                  Sign Up
                </Button>

                <Typography textAlign="center" m={"1rem"}>
                  OR
                </Typography>

                <Button
                  variant="text"
                  type="submit"
                  onClick={toggleLogin}
                  fullWidth
                  t
                >
                  Login Instead
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
