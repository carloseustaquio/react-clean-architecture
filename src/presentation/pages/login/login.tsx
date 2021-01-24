import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Styles from "./login-styles.scss";
import {
  Footer,
  LoginHeader,
  Input,
  FormStatus,
  SubmitButton,
} from "@/presentation/components";
import Context from "@/presentation/contexts/form/form-context";
import { Validation } from "@/presentation/protocols/validation";
import { Authentication, SaveAccessToken } from "@/domain/usecases";

type Props = {
  validation: Validation;
  authentication: Authentication;
  saveAccessToken: SaveAccessToken;
};

const Login: React.FC<Props> = ({
  authentication,
  validation,
  saveAccessToken,
}: Props) => {
  const history = useHistory();
  const [state, setState] = useState({
    isLoading: false,
    isFormInvalid: true,
    email: "",
    password: "",
    errors: {
      email: "",
      password: "",
      form: "",
    },
  });

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    try {
      if (state.isLoading || state.isFormInvalid) return;

      setState({
        ...state,
        isLoading: true,
      });
      const account = await authentication.auth({
        email: state.email,
        password: state.password,
      });
      await saveAccessToken.save(account.accessToken);
      history.replace("/");
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
    const email = validation.validate("email", state.email);
    const password = validation.validate("password", state.password);
    setState({
      ...state,
      isFormInvalid: !!(email || password),
      errors: {
        ...state.errors,
        email,
        password,
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
          <SubmitButton text="Enviar" />
          <Link data-testid="link-signup" to="/signup" className={Styles.link}>
            Criar conta
          </Link>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  );
};

export default Login;
