export interface LoginDialogPropsType {
  closeLoginDialog: () => void;
}

export interface PostUserType {
  Name: string;
  Password: string;
  Gender: string;
  Age: number;
}

export interface UserDataType {
  id: number;
  name: string;
  password: string;
  gender: string;
  age: number;
  created_at: string;
}