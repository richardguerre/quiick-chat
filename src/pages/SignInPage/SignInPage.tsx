import React from "react";
import FadeIn from "react-fade-in";
import { useLocalStore } from "utils/hooks-storage";
import { Redirect } from "react-router-dom";

import AuthButtons from "components/AuthButtons/AuthButtons";

import "./SignInPage.scss";
import { FireUser } from "utils/types";

const SignInPage = () => {
  const [fireUser] = useLocalStore<FireUser>("fireUser");

  if (fireUser) return <Redirect to="/" />;

  return (
    <div className="SignInPage">
      <FadeIn className="container">
        <h2>Sign in</h2>
        <AuthButtons />
        <sub>
          Don’t have an account yet? <a href="/signup">Sign up</a>
        </sub>
      </FadeIn>
    </div>
  );
};

export default SignInPage;
