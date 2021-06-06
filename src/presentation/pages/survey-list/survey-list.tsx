import React, { useContext, useEffect, useState } from "react";
import Styles from "./list-styles.scss";
import { Footer, Header } from "@/presentation/components";
import {
  SurveyContext,
  SurveyError,
  SurveyListItems,
} from "@/presentation/pages/survey-list/components";
import { LoadSurveyList } from "@/domain/usecases";
import { AccessDeniedError } from "@/domain/errors";
import { ApiContext } from "@/presentation/contexts";
import { useHistory } from "react-router";

type Props = {
  loadSurveyList: LoadSurveyList;
};

const SurveyList: React.FC<Props> = ({ loadSurveyList }: Props) => {
  const { setCurrentAccount } = useContext(ApiContext);
  const history = useHistory();
  const [state, setState] = useState({
    surveys: [] as LoadSurveyList.Model[],
    error: "",
    reload: false,
  });

  useEffect(() => {
    loadSurveyList
      .loadAll()
      .then((surveys) => setState((prevState) => ({ ...prevState, surveys })))
      .catch((error) => {
        if (error instanceof AccessDeniedError) {
          setCurrentAccount(undefined);
          history.replace("/login");
        } else {
          setState((prevState) => ({ ...prevState, error: error.message }));
        }
      });
  }, [state.reload]);

  return (
    <div className={Styles.surveyListWrap}>
      <Header />
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
