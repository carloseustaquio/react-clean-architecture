import React, { useEffect, useState } from "react";
import Styles from "./signup.scss";
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

const SignUp: React.FC<Props> = ({ validation }: Props) => {
  const [state, setState] = useState({
    isLoading: false,
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const handleDisableButton = (): boolean => {
    return !!(
      state.errors.name ||
      state.errors.email ||
      state.errors.password ||
      state.errors.passwordConfirmation
    );
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
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
        name: validation.validate("name", state.name),
        email: validation.validate("email", state.email),
        password: validation.validate("password", state.email),
        passwordConfirmation: validation.validate(
          "passwordConfirmation",
          state.email
        ),
      },
    });
  }, [state.name, state.email, state.password, state.passwordConfirmation]);

  return (
    <div className={Styles.signup}>
      <LoginHeader />
      <Context.Provider value={{ state, setState }}>
        <form
          data-testid="form"
          className={Styles.form}
          onSubmit={handleSubmit}
        >
          <h2>Criar Conta</h2>
          <Input type="text" name="name" placeholder="Digite seu nome" />
          <Input type="email" name="email" placeholder="Digite seu email" />
          <Input
            type="password"
            name="password"
            placeholder="Digite sua senha"
          />
          <Input
            type="password"
            name="passwordConfirmation"
            placeholder="Repita sua senha"
          />
          <button
            data-testid="submit"
            className={Styles.submit}
            type="submit"
            disabled={handleDisableButton()}
          >
            Enviar
          </button>
          <span className={Styles.link}>Voltar para Login</span>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  );
};

export default SignUp;
