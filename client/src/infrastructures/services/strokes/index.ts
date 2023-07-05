import { TPostStrokeData } from "@/@types/note";
import { API_URL } from "@/configs/settings";
import axios from "axios";

const API_PROD_URL = "https://ppundo.nkmr.io/api"

// idからストロークの取得
export const fetchStrokeByID = async(id: number) => {
  const url =`${API_URL}/strokes/${id}`;
  try {
    const res = await axios.get(url);
    if (res.status === 200) {
      return res.data;
    } else {
      console.log(res);
      return null;
    }
  } catch(error) {
    throw(error);
  }
}

// nidからストロークの取得
export const fetchStrokesByNID = async(nid: number) => {
  const url =`${API_PROD_URL}/strokes/in/note/${nid}`;
  try {
    const res = await axios.get(url);
    if (res.status === 200) {
      return res.data;
    } else {
      console.log(res);
      return null;
    }
  } catch(error) {
    throw(error);
  }
}

// ストロークの追加
export const addStroke = async (data: TPostStrokeData) => {
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

export const updateStrokeGroupNum = async(id1: number, id2: number, gnum: number) => {
  const url = `${API_PROD_URL}/strokes/group/${id1}/${id2}/${gnum}`;
  try {
    const res = await axios.get(url);
    if (res.status === 200) {
      return res.data;
    } else {
      console.log(res);
      return null;
    }
  } catch(error) {
    throw(error);
  }
}

export const updateTransformPressures = async(nid: number, pressure: number) => {
  const url = `${API_URL}/strokes/update/pressures`;
  try {
    const res = await axios.get(url,  {params: {nid: nid, pressure: pressure}})
    if (res.status === 200) {
      return res.data;
    } else {
      console.log(res);
      return null;
    }
  } catch(error) {
    throw(error);
  }
}