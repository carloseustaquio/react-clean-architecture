import React, { ReactElement } from "react";
import { makeLoginValidation } from "./login-validation-factory";
import { makeRemoteAuthentication } from "@/main/factories/usecases/authentication/remote-authentication-factory";
import { Login } from "@/presentation/pages";
import { makeLocalSaveAccessToken } from "@/main/factories/usecases/save-access-token/local-save-access-token-factory";

export const makeLogin = (): ReactElement => {
  return (
    <Login
      validation={makeLoginValidation()}
      authentication={makeRemoteAuthentication()}
      saveAccessToken={makeLocalSaveAccessToken()}
    />
  );
};
