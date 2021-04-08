import React, { ReactElement } from "react";
import { SurveyList } from "@/presentation/pages";
import { makeRemoteLoadSurveyList } from "@/main/factories/usecases";

export const makeSurveyList = (): ReactElement => {
  return <SurveyList loadSurveyList={makeRemoteLoadSurveyList()} />;
};
