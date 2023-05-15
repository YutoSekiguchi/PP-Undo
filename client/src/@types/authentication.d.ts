export interface TLoginDialogProps {
  closeLoginDialog: () => void;
}

export interface TPostUser {
  Name: string;
  Password: string;
  Gender: string;
  Age: number;
}

export interface TUserData {
  ID: number;
  Name: string;
  Password: string;
  Gender: string;
  Age: number;
  CreatedAt: string;
}