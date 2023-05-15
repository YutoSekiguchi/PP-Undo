import { TPostUser } from "@/@types/authentication";
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
    throw(e);
  }
}

export const addUser = async (data: TPostUser) => {
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
    throw(e);
  }
}