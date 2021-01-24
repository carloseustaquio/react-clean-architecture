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
import { AddAccount, SaveAccessToken } from "@/domain/usecases";
import { Link, useHistory } from "react-router-dom";

type Props = {
  validation: Validation;
  addAccount: AddAccount;
  saveAccessToken: SaveAccessToken;
};

const SignUp: React.FC<Props> = ({
  validation,
  addAccount,
  saveAccessToken,
}: Props) => {
  const [state, setState] = useState({
    isLoading: false,
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: {
      form: "",
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });
  const history = useHistory();

  const handleDisableButton = (): boolean => {
    return !!(
      state.errors.name ||
      state.errors.email ||
      state.errors.password ||
      state.errors.passwordConfirmation
    );
  };

  const hasFormErrors = () => {
    return (
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

    if (state.isLoading || hasFormErrors()) return;

    setState({
      ...state,
      isLoading: true,
    });

    try {
      const account = await addAccount.add({
        name: state.name,
        email: state.email,
        password: state.password,
        passwordConfirmation: state.passwordConfirmation,
      });
      await saveAccessToken.save(account.accessToken);
      history.replace("/");
    } catch (err) {
      setState({
        ...state,
        errors: {
          ...state.errors,
          form: err.message,
        },
      });
    }
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
          <Link data-testid="login" to="/login" className={Styles.link}>
            Voltar para Login
          </Link>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  );
};

export default SignUp;
