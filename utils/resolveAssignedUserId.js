module.exports = async (assignedUserId) => {
  if (!assignedUserId) return null;

  if (assignedUserId.length < 5) {
    throw new Error("Invalid user");
  }

  return assignedUserId;
};