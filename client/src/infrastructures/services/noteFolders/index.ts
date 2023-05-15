import { TPostNoteFolder } from "@/@types/notefolders";
import { API_URL } from "@/configs/settings";
import axios from "axios";

export const fetchNoteFoldersByUIDAndParentNFID = async (uid: number, pnfid: number) => {
  const url = `${API_URL}/notefolders/hierarchy/${uid}/${pnfid}`;
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

// フォルダの木構造を取得
export const fetchNoteFoldersTree = async (nfid: number) => {
  const url = `${API_URL}/notefolders/tree/${nfid}`;
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

export const addNoteFolder = async (data: TPostNoteFolder) => {
  const url = `${API_URL}/notefolders`;
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

export const updateNoteFolderTitle = async (id: number, title: string) => {
  const url = `${API_URL}/notefolders`;
  try {
    const res = await axios.put(url, {id: id, name: title});
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