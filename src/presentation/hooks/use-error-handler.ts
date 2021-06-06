import { AccessDeniedError } from "@/domain/errors";
import { useContext } from "react";
import { useHistory } from "react-router";
import { ApiContext } from "../contexts";

type CallbackType = (error: Error) => void;
type ResultType = CallbackType;

export const useErrorHandler = (callback: CallbackType): ResultType => {
  const { setCurrentAccount } = useContext(ApiContext);
  const history = useHistory();

  return (error: Error): void => {
    if (error instanceof AccessDeniedError) {
      setCurrentAccount(undefined);
      history.replace("/login");
    } else {
      callback(error);
    }
  };
};
