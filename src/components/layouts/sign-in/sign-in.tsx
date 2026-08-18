import * as React from "react";

import { Session } from "@/types/session";

import { TextInput } from "@/components/base/text-input";
import { PasswordInput } from "@/components/base/password-input";
import { Button } from "@/components/base/button";
import { Alert } from "@/components/base/alert";

import { MailIcon } from "@/components/icons/mail-icon";
import { KeyIcon } from "@/components/icons/key-icon";
import { SignInIcon } from "@/components/icons/sign-in-icon";
import { SpinnerIcon } from "@/components/icons/spinner-icon";

import { useForm } from "@/hooks/use-form";
import { useTimeout } from "@/hooks/use-timeout";

import { makeSignInService } from "@/services/sign-in-service";

import logoPng from "@/assets/images/logo.png";

import cls from "./sign-in.module.scss";

type SignInProps = {
  onSignInSuccess: (session: Session) => void;
};

export const SignIn = (props: SignInProps): JSX.Element => {
  const { onSignInSuccess } = props;

  const [email, setEmail] = React.useState<string>("");

  const [password, setPassword] = React.useState<string>("");

  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  const { startTimeout } = useTimeout();

  const handleSuccess = React.useCallback(
    (data: unknown) => {
      const session = data as Session;

      setIsSuccess(true);
      startTimeout(() => {
        onSignInSuccess(session);
      }, delayAftersuccess);
    },
    [startTimeout, onSignInSuccess],
  );

  const { isLoading, alertData, validation, submit } = useForm({
    serviceMaker: makeSignInService,
    onSuccess: handleSuccess,
  });

  const handleSubmit = React.useCallback(() => {
    submit({
      email,
      password,
      role: "manager",
    });
  }, [email, password, submit]);

  return (
    <>
      {/* <div className={cls["test_env"]}>Test Environment</div> */}
      <div className={cls["sign-in"]}>
        <div className={cls["sign-in__box"]}>
          <img
            className={cls["sign-in__logo"]}
            src={logoPng}
            alt="Empire World Logo"
          />
          <h1 className={cls["sign-in__welcome"]}>
            Welcome to Empire World General Services Portal
          </h1>
          <p className={cls["sign-in__cta"]}>
            Please enter your credentials to continue.
          </p>
          {alertData !== null && (
            <Alert
              className="mb-2"
              message={alertData.message}
              severity={alertData.severity}
            />
          )}
          <TextInput
            className="w-100"
            label="Email"
            placeholder="Enter your email."
            icon={<MailIcon />}
            value={email}
            feedback={validation.email}
            hasInitialFocus
            isRequired
            isDisabled={isLoading || isSuccess}
            hasError={typeof validation.email !== "undefined"}
            onChange={setEmail}
          />
          <PasswordInput
            className="w-100 mt-1"
            label="Password"
            placeholder="Enter your password."
            icon={<KeyIcon />}
            value={password}
            feedback={validation.password}
            isRequired
            isDisabled={isLoading || isSuccess}
            hasError={typeof validation.password !== "undefined"}
            onChange={setPassword}
          />
          <Button
            className="w-100 mt-2"
            label="SIGN IN"
            icon={isLoading ? <SpinnerIcon /> : <SignInIcon />}
            isDisabled={isLoading || isSuccess}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </>
  );
};

const delayAftersuccess = 2000;
