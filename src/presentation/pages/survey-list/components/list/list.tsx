import React, { useContext } from "react";
import {
  SurveyItemEmpty,
  SurveyItem,
  SurveyContext,
} from "@/presentation/pages/survey-list/components";
import Styles from "./list-styles.scss";
import { LoadSurveyList } from "@/domain/usecases";

const SurveyListItems: React.FC = () => {
  const { state } = useContext(SurveyContext);
  return (
    <ul className={Styles.listWrap} data-testid="survey-list">
      {state.surveys.length ? (
        state.surveys.map((survey: LoadSurveyList.Model) => (
          <SurveyItem key={survey.id} survey={survey} />
        ))
      ) : (
        <SurveyItemEmpty />
      )}
    </ul>
  );
};

export default SurveyListItems;
