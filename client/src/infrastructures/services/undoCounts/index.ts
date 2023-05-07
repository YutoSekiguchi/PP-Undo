import { TPostUndoCountData } from "@/@types/note";
import { API_URL } from "@/configs/settings";
import axios from "axios";

// Undoカウント
export const addUndoCount = async (data: TPostUndoCountData) => {
  const url = `${API_URL}/undocounts`;
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