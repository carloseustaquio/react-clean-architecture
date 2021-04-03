import React, { useContext } from "react";
import Styles from "./form-status-styles.scss";
import { Spinner } from "@/presentation/components";
import { FormContext } from "@/presentation/contexts";

const FormStatus: React.FC = () => {
  const {
    state: { isLoading, errors },
  } = useContext(FormContext);
  const formError = errors.form;

  return (
    <div data-testid="errorWrap" className={Styles.errorWrap}>
      {isLoading && <Spinner className={Styles.spinner} />}
      {formError && (
        <span data-testid="form-error" className={Styles.error}>
          {formError}
        </span>
      )}
    </div>
  );
};

export default FormStatus;
