import { PostUserType } from "@/@types/authentication";
import { API_URL } from "@/configs/settings";
import axios from "axios";

export const fetchUserDataByNameAndPassword = async(name: string, password: string) => {
  const url = `${API_URL}/examusers/me?Name=${name}&Password=${password}`;
  try {
    const res = await axios.get(url);
    if (res.status==200) {
      return res.data;
    } else {
      console.log(res);
      return null;
    }
  } catch(e) {
    console.log(e);
    return null;
  }
}

export const addUser = async (data: PostUserType) => {
  const url = `${API_URL}/examusers`;
  try {
    const res = await axios.post(url, data);
    if (res.status === 200) {
      return res.data;
    } else {
      console.log(res);
      return null;
    }
  } catch(e) {
    console.log(e);
    return null;
  }
}