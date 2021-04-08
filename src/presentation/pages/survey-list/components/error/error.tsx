import React, { useContext } from "react";
import { SurveyContext } from "@/presentation/pages/survey-list/components";
import Styles from "./error-styles.scss";

const SurveyError = () => {
  const { state, setState } = useContext(SurveyContext);
  const reload = (): void => {
    setState((prevState) => ({
      surveys: [],
      error: "",
      reload: !prevState.reload,
    }));
  };
  return (
    <div className={Styles.errorWrap}>
      <span data-testid="error">{state.error}</span>
      <button data-testid="reload" onClick={reload}>
        Recarregar
      </button>
    </div>
  );
};

export default SurveyError;
