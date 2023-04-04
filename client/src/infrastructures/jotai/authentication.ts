import { API_URL } from '@/configs/settings';
import { atom } from 'jotai';
import axios from 'axios';
import { addUser, fetchUserDataByNameAndPassword } from '@/modules/authentication/Auth';
import lscache from 'lscache';

/**
 * @description
 * ユーザ情報の保持
 */
export const userDataAtom = atom<any>(null);

export interface AuthType {
  userName: string;
  password: string;
}

/**
 * @description
 * サインイン
 */
export const signinAtom = atom(null, async (_get, set, obj: AuthType) => {
  const userData = await fetchUserDataByNameAndPassword(obj.userName, obj.password);
  if (userData == null) {
    // 追加処理
    const postUserData = {
      Name: obj.userName,
      Password: obj.password,
      Gender: "",
      Age: 0,
    }
    const addUserResData = await addUser(postUserData);
    if (addUserResData != null) {
      set(userDataAtom, addUserResData);
    }
    lscache.set('loginUserData', addUserResData, 180);
    return addUserResData;
  } else {
    // 存在する場合
    return null;
  }
})

/**
 * @description
 * ログイン
 */
export const loginAtom = atom(null, async (_get, set, obj: AuthType) => {
  const userData = await fetchUserDataByNameAndPassword(obj.userName, obj.password);
  set(userDataAtom, userData);
  lscache.set('loginUserData', userData, 180);
  return userData;
})