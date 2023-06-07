import { TPostEraseSelectedObjectsCountData } from "@/@types/note";
import { API_URL } from "@/configs/settings";
import axios from "axios";

// 選択範囲削除カウント
export const addEraseSelectedObjectsCount = async (data: TPostEraseSelectedObjectsCountData) => {
  const url = `${API_URL}/eraseselectedobjectscounts`;
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