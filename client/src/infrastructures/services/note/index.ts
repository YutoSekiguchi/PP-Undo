import { TNoteData, TPostNote } from "@/@types/notefolders";
// import { TNoteDataWithoutLongData } from "@/@types/note";
import { API_URL } from "@/configs/settings";
import axios from "axios";

// nfidとuidからノートの取得
export const fetchNotesByNFIDAndUID = async (nfid: number, uid: number) => {
  const url = `${API_URL}/notes/user/${uid}/in/${nfid}`;
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

// 全てのノートの重いdata以外を取得
export const fetchAllNotesWithoutLongData = async() => {
  const url = `${API_URL}/notes/short`;
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
export const addNote = async (data: TPostNote) => {
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

export const updateNote = async (data: TNoteData) => {
  const url = `${API_URL}/notes/${data.ID}`;
  try {
    const res = await axios.put(url, data);
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

export const updateNoteTitle = async (id: number, title: string) => {
  const url = `${API_URL}/notes`;
  try {
    const res = await axios.put(url, {ID: id, Title: title});
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

// delete
export const deleteNote = async (id: number) => {
  const url = `${API_URL}/notes/${id}`;
  try {
    const res = await axios.delete(url);
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