import { PostNoteType } from "@/@types/notefolders";
import { API_URL } from "@/configs/settings";
import axios from "axios";

// nfidからノートの取得
export const fetchNotesByNFID = async (nfid: number) => {
  const url = `${API_URL}/notes/in/${nfid}`;
  try {
    const res = await axios.get(url);
    if (res.status === 200) {
      return res.data;
    } else {
      console.log(res);
      return [];
    }
  } catch (error) {
    throw(error);
  }
}

// idからノートの取得
export const fetchNoteByID = async (id: number) => {
  const url = `${API_URL}/notes/${id}`;
  try {
    const res = await axios.get(url);
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


// ノートの追加
export const addNote = async (data: PostNoteType) => {
  const url = `${API_URL}/notes`;
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