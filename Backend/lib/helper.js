export const getOtherMember = (members, userId) => {
  members.find((member) => member._id.toString() !== userId.toString());
};

export const getSokets = (users = []) => {
  const sockets = users.map((user) => userSocketIDs.get(user._id.toString()));

  return sockets;
};
