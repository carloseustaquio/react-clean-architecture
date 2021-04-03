import React, { useContext, useRef } from "react";
import Styles from "./input-styles.scss";
import { FormContext } from "@/presentation/contexts";

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const Input: React.FC<Props> = (props: Props) => {
  const inputRef = useRef<HTMLInputElement>();
  const { state, setState } = useContext(FormContext);
  const errors = state.errors;
  const error = errors[props.name];

  const enableInput = (event: React.FocusEvent<HTMLInputElement>): void => {
    event.target.readOnly = false;
  };

  const handleChange = (event: React.FocusEvent<HTMLInputElement>): void => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div
      data-testid={props.name + "-wrap"}
      className={Styles.inputWrap}
      data-status={error ? "invalid" : "valid"}
    >
      <input
        {...props}
        ref={inputRef}
        title={error}
        placeholder=" "
        readOnly
        data-testid={props.name}
        onFocus={enableInput}
        onChange={handleChange}
      />
      <label
        data-testid={props.name + "-label"}
        onClick={() => inputRef.current.focus()}
        title={error}
      >
        {props.placeholder}
      </label>
    </div>
  );
};

export default Input;
