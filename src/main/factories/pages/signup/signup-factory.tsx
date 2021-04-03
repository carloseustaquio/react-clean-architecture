import React, { ReactElement } from "react";
import { makeSignupValidation } from "./signup-validation-factory";
import { SignUp } from "@/presentation/pages";
import { makeRemoteAddAccount } from "@/main/factories/usecases/add-account/remote-add-account-factory";

export const makeSignUp = (): ReactElement => {
  return (
    <SignUp
      addAccount={makeRemoteAddAccount()}
      validation={makeSignupValidation()}
    />
  );
};
