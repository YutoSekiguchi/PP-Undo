import { PostPPUndoCountsDataType } from "@/@types/note";
import { API_URL } from "@/configs/settings";
import axios from "axios";

// PPUndo回数の追加
export const addPPUndoCount = async (data: PostPPUndoCountsDataType) => {
  const url = `${API_URL}/ppundocounts`;
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