import { PostStrokeDataType } from "@/@types/note";
import { API_URL } from "@/configs/settings";
import axios from "axios";

// ストロークの追加
export const addStroke = async (data: PostStrokeDataType) => {
  const url =`${API_URL}/strokes`;
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