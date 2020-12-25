import React, { useContext } from "react";
import Styles from "./form-status-styles.scss";
import { Spinner } from "@/presentation/components";
import Context from "@/presentation/contexts/form/form-context";

const FormStatus: React.FC = () => {
  const { isLoading, errors } = useContext(Context);
  const formError = errors.form;

  return (
    <div data-testid="errorWrap" className={Styles.errorWrap}>
      {isLoading && <Spinner className={Styles.spinner} />}
      {formError && <span className={Styles.error}>{formError}</span>}
    </div>
  );
};

export default FormStatus;
