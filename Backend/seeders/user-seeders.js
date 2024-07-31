import { faker } from "@faker-js/faker";
import { User } from "../models/user-models.js";


// Function to create a specified number of users.
const createUser = async (numUsers) => {
  try {
    const usersPromise = [];

    // Create users in parallel to speed up the process.
    for (let i = 0; i < numUsers; i++) {
      const tempUser = User.create({
        name: faker.person.fullName(),
        username: faker.internet.userName(),
        bio: faker.lorem.sentence(10),
        password: "password",
        avatarL: {
          url: faker.image.avatar(),
          public_id: faker.system.fileName(),
        },
      });
      
      // Save the user to the database.
      // Add the created user to the array of promises.
      usersPromise.push(tempUser);
    }

    // Wait for all users to be created and return the array of users.
    await Promise.all(usersPromise);
    console.log('user Created ', numUsers);
    process.exit(1);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export { createUser };

