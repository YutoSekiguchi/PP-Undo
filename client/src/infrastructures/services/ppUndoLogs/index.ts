import { PostClientLogDataType, PostLogDataType } from "@/@types/note";
import { API_URL } from "@/configs/settings";
import axios from "axios";

// ログの追加
export const addLog = async (data: PostLogDataType) => {
  const url = `${API_URL}/logs`;
  try {
    const res = await axios.post(url, data);
    if (res.status == 200) {
      return res.data;
    } else {
      console.log(res);
      return null;
    }
  } catch (error) {
    throw(error)
  }
}

// クライアント用のLogを追加
export const addClientLog = async (data: PostClientLogDataType) => {
  const url = `${API_URL}/clientlogs`;
  try {
    const res = await axios.post(url, data);
    if (res.status == 200) {
      return res.data;
    } else {
      console.log(res);
      return null;
    }
  } catch (error) {
    throw(error);
  }
}

// クライアント用のログの取得
export const fetchClientLogsByNID = async (nid: number) => {
  const url = `${API_URL}/clientlogs/in/${nid}`;
  try {
    const res = await axios.get(url);
    if (res.status == 200) {
      return res.data;
    } else {
      console.log(res);
      return null;
    }
  } catch (error) {
    throw(error);
  }
}