import React, { ReactElement } from "react";
import { makeLoginValidation } from "./login-validation-factory";
import { makeRemoteAuthentication } from "@/main/factories/usecases";
import { Login } from "@/presentation/pages";

export const makeLogin = (): ReactElement => {
  return (
    <Login
      validation={makeLoginValidation()}
      authentication={makeRemoteAuthentication()}
    />
  );
};
