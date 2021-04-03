import React, { ReactElement } from "react";
import { makeLoginValidation } from "./login-validation-factory";
import { makeRemoteAuthentication } from "@/main/factories/usecases/authentication/remote-authentication-factory";
import { Login } from "@/presentation/pages";
import { makeLocalUpadateCurrentAccount } from "@/main/factories/usecases/update-current-account/local-update-current-account-factory";

export const makeLogin = (): ReactElement => {
  return (
    <Login
      validation={makeLoginValidation()}
      authentication={makeRemoteAuthentication()}
      updateCurrentAccount={makeLocalUpadateCurrentAccount()}
    />
  );
};
