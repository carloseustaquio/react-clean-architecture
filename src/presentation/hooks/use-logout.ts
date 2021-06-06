import { useContext } from "react";
import { useHistory } from "react-router";
import { ApiContext } from "@/presentation/contexts";

type ResultType = () => void;

export const useLogout = (): ResultType => {
  const { setCurrentAccount } = useContext(ApiContext);
  const history = useHistory();

  return (): void => {
    setCurrentAccount(undefined);
    history.replace("/login");
  };
};
