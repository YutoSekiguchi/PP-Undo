import { TPostRedoCountData } from "@/@types/note";
import { API_URL } from "@/configs/settings";
import axios from "axios";

// Redoカウント
export const addRedoCount = async (data: TPostRedoCountData) => {
  const url = `${API_URL}/redocounts`;
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