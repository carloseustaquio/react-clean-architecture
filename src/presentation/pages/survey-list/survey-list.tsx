import React, { useEffect, useState } from "react";
import Styles from "./list-styles.scss";
import { Footer, Header } from "@/presentation/components";
import {
  SurveyContext,
  SurveyError,
  SurveyListItems,
} from "@/presentation/pages/survey-list/components";
import { LoadSurveyList } from "@/domain/usecases";

type Props = {
  loadSurveyList: LoadSurveyList;
};

const SurveyList: React.FC<Props> = ({ loadSurveyList }: Props) => {
  const [state, setState] = useState({
    surveys: [] as LoadSurveyList.Model[],
    error: "",
    reload: false,
  });

  useEffect(() => {
    loadSurveyList
      .loadAll()
      .then((surveys) => setState((prevState) => ({ ...prevState, surveys })))
      .catch((error) =>
        setState((prevState) => ({ ...prevState, error: error.message }))
      );
  }, [state.reload]);

  return (
    <div className={Styles.surveyListWrap}>
      <Header userName="Carlos Eustáquio" />
      <div className={Styles.contentWrap}>
        <h2>Enquetes</h2>
        <SurveyContext.Provider value={{ state, setState }}>
          {state.error ? <SurveyError /> : <SurveyListItems />}
        </SurveyContext.Provider>
      </div>
      <Footer />
    </div>
  );
};

export default SurveyList;
