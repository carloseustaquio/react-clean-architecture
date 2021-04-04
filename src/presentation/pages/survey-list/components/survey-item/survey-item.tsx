import React from "react";
import { Icon, IconName } from "@/presentation/components";
import Styles from "./survey-item-styles.scss";

const SurveyItem: React.FC = () => {
  return (
    <li className={Styles.surveyItemWrap}>
      <div className={Styles.surveyContent}>
        <Icon iconName={IconName.thumbsDown} className={Styles.iconWrap} />
        <time>
          <span className={Styles.day}>19</span>
          <span className={Styles.month}>mar</span>
          <span className={Styles.year}>2021</span>
        </time>
        <p>Qual é sua linguagem de programação preferida?</p>
      </div>
      <footer>Ver Resultado</footer>
    </li>
  );
};

export default SurveyItem;
