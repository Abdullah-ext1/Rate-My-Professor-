import mongoose from "mongoose";

const getCollegeFilter = (user) => {
  // If user has a college assigned, strictly filter by that college
  if (user.college) {
    const collegeId = user.college instanceof mongoose.Types.ObjectId
      ? user.college
      : new mongoose.Types.ObjectId(user.college);
    return { college: collegeId };
  }

  // Admins without a specific college can see everything
  if (user.role === 'admin' && !user.college) {
    return {};
  }

  // If a regular user or moderator doesn't have a college somehow, 
  // return a condition that matches NO professors to prevent seeing cross-college profs
  return { college: null };
}

export { getCollegeFilter };
