import { User } from "../models/user-models.js";

// Create a new user and save it to the database and save the JWT token in the response...

const newUser = async (req, res) => {

  const {} = req.body;
  

  const Avatar = {

    public_id: "wsdasd",
    url: "https://example.com/avatar.jpg", 
  };

  await User.create({
    name: "John Doe",
    username: "John Doe",
    password: "password123",
    Avatar,
  });

  res.status(201).json({ message: "User created successfully" });

  res.send("nice");
};

const login = (req, res) => {
  res.send("nice");
};

export { login, newUser };
