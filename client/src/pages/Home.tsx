import { userDataAtom } from "@/infrastructures/jotai/authentication";
import { isAuth } from "@/modules/common/isAuth";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";

export const Home:React.FC =() => {
  const [loginUserData, ] = useAtom(userDataAtom);

  return (
    <>
      {
        isAuth() || loginUserData != null
        ? <>
        </>
        : <h1>PP-Undo</h1>
      }
    </>
  );
}