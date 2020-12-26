import React, { useState, useEffect } from "react";
import Styles from "./login-styles.scss";
import {
  Footer,
  LoginHeader,
  Input,
  FormStatus,
} from "@/presentation/components";
import Context from "@/presentation/contexts/form/form-context";
import { Validation } from "@/presentation/protocols/validation";

type Props = {
  validation: Validation;
};

const Login: React.FC<Props> = ({ validation }: Props) => {
  const [state, setState] = useState({
    isLoading: false,
    email: "",
    password: "",
    errors: {
      email: "",
      password: "",
      form: "",
    },
  });

  const handleDisableButton = (): boolean => {
    return !!(state.errors.password || state.errors.email);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setState({
      ...state,
      isLoading: true,
    });
  };

  useEffect(() => {
    setState({
      ...state,
      errors: {
        ...state.errors,
        email: validation.validate("email", state.email),
        password: validation.validate("password", state.password),
      },
    });
  }, [state.email, state.password]);

  return (
    <div className={Styles.login}>
      <LoginHeader />
      <Context.Provider value={{ state, setState }}>
        <form className={Styles.form} onSubmit={handleSubmit}>
          <h2>Login</h2>
          <Input type="email" name="email" placeholder="Digite seu email" />
          <Input
            type="password"
            name="password"
            placeholder="Digite sua senha"
          />
          <button
            data-testid="submit"
            className={Styles.submit}
            type="submit"
            disabled={handleDisableButton()}
          >
            Enviar
          </button>
          <span className={Styles.link}>Criar conta</span>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  );
};

export default Login;
