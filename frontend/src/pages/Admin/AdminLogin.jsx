import { useInputValidation } from "6pp";
import { Button, Container, Paper, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { bgGradient } from "../../constants/color";
import { adminLogin, getAdmin } from "../../redux/thunks/Admin-thunks";
// Replace with your own logic to check if user is admin

const AdminLogin = () => {
  const { isAdmin } = useSelector((state) => state.auth);
  const dispatch = useDispatch()
  const secretKey = useInputValidation("");

  const submitHandler = (e) => {
    e.preventDefault();
    // Perform your login logic here
    dispatch(adminLogin(secretKey.value))
  };


  useEffect(()=>{
    dispatch(getAdmin())
  },[dispatch])

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
