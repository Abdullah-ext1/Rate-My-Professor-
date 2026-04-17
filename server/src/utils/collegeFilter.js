const getCollegeFilter = (user) => {
  // Admins can see professors from all colleges
  if (user.role === 'admin') {
    return {};
  }
  
  // If user has a college assigned, filter by that college
  if (user.college) {
    return { college: user.college };
  }
  
  // If user doesn't have a college yet (during onboarding), return empty filter
  // This allows them to see all professors or no professors based on other criteria
  return {};
}

export { getCollegeFilter };