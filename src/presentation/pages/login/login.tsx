import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import Styles from "./login-styles.scss";
import {
  Footer,
  LoginHeader,
  Input,
  FormStatus,
  SubmitButton,
} from "@/presentation/components";
import { FormContext, ApiContext } from "@/presentation/contexts";
import { Validation } from "@/presentation/protocols/validation";
import { Authentication } from "@/domain/usecases";

type Props = {
  validation: Validation;
  authentication: Authentication;
};

const Login: React.FC<Props> = ({ authentication, validation }: Props) => {
  const { setCurrentAccount } = useContext(ApiContext);
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
      setCurrentAccount(account);
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
    const formData = { email: state.email, password: state.password };
    const email = validation.validate("email", formData);
    const password = validation.validate("password", formData);
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
    <div className={Styles.loginWrap}>
      <LoginHeader />
      <FormContext.Provider value={{ state, setState }}>
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
      </FormContext.Provider>
      <Footer />
    </div>
  );
};

export default Login;
