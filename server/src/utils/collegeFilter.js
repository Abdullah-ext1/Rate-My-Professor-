const getCollegeFilter = (user) => {
  return user.role === 'admin' ? {} : { college: user.college }
}

export { getCollegeFilter }