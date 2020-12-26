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
import { Authentication } from "@/domain/usecases";

type Props = {
  validation: Validation;
  authentication: Authentication;
};

const Login: React.FC<Props> = ({ authentication, validation }: Props) => {
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

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    try {
      if (state.isLoading || state.errors.email || state.errors.password)
        return;

      setState({
        ...state,
        isLoading: true,
      });
      await authentication.auth({
        email: state.email,
        password: state.password,
      });
    } catch (error) {
      setState({
        ...state,
        errors: {
          ...state.errors,
          form: error.message,
        },
      });
    }
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
        <form
          data-testid="form"
          className={Styles.form}
          onSubmit={handleSubmit}
        >
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
