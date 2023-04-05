import lscache from "lscache";

export const isAuth = () => {
  if (lscache.get('loginUserData')) {
    return true
  }
  return false
}