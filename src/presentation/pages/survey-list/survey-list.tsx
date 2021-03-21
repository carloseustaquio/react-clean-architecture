import { Footer, Header, Icon, IconName } from "@/presentation/components";
import React from "react";
import Styles from "./survey-list-styles.scss";

const SurveyList: React.FC = () => {
  return (
    <div className={Styles.surveyListWrap}>
      <Header userName="Carlos Eustáquio" />
      <div className={Styles.contentWrap}>
        <h2>Enquetes</h2>
        <ul>
          <li>
            <div className={Styles.surveyContent}>
              <Icon
                iconName={IconName.thumbsDown}
                className={Styles.iconWrap}
              />
              <time>
                <span className={Styles.day}>19</span>
                <span className={Styles.month}>mar</span>
                <span className={Styles.year}>2021</span>
              </time>
              <p>Qual é sua linguagem de programação preferida?</p>
            </div>
            <footer>Ver Resultado</footer>
          </li>
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default SurveyList;
