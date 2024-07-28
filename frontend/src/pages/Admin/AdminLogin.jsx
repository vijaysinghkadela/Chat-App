import { useInputValidation } from "6pp";
import {
    Button,
    Container,
    Paper,
    TextField
} from "@mui/material";
import React from "react";
import { Navigate } from "react-router-dom";
import { bgGradient } from "../../constants/color";

// Replace with your own logic to check if user is admin
const isAdmin = true;

const AdminLogin = () => {
  const secretKey = useInputValidation("");

  const submitHandler = (e) => {
    e.preventDefault();
    // Perform your login logic here
    console.log("Admin Login Successful");
  };

  if (isAdmin) return <Navigate to="/admin/dashboard" />;

  return (
    <div
      style={{
        backgroundImage: bgGradient,
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
          isLogin <typegraphy variant="h5">Admin Login</typegraphy>
          <form
            action=""
            style={{
              width: "100%",
            }}
            onSubmit={submitHandler}
          >
            <TextField
              sx={{
                marginTop: "1rem",
              }}
              required
              fullWidth
              label="Scret Key"
              type="password"
              margin="normel"
              variant="outlined"
              value={secretKey.value}
              onChange={secretKey.changeHandler}
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
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default AdminLogin;
