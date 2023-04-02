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
  ID: number;
  Name: string;
  Password: string;
  Gender: string;
  Age: number;
  CreatedAt: string;
}