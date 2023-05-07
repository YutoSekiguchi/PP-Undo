import { TPostLogRedoCountsData } from "@/@types/note";
import { API_URL } from "@/configs/settings";
import axios from "axios";

// LogRedoカウント
export const addLogRedoCount = async (data: TPostLogRedoCountsData) => {
  const url = `${API_URL}/logredocounts`;
  try {
    const res = await axios.post(url, data);
    if (res.status === 200) {
      return res.data;
    } else {
      console.log(res);
      return null;
    }
  } catch (error) {
    throw(error);
  }
}