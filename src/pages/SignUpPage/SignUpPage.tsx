import React from "react";
import FadeIn from "react-fade-in";
import { useLocalStore, useSessionStore } from "utils/hooks-storage";
import { Redirect } from "react-router-dom";

import AuthButtons from "components/AuthButtons/AuthButtons";
import CreateProfilePage from "./CreateProfilePage/CreateProfilePage";

import "./SignUpPage.scss";
import { FireUser } from "utils/types";

const SignUpPage = () => {
  const [fireUser] = useLocalStore<FireUser>("fireUser");
  const [createdProfile] = useSessionStore<boolean>("createdProfile");

  if (fireUser && createdProfile) return <Redirect to="/" />;

  if (fireUser && !createdProfile) {
    return <CreateProfilePage />;
  }

  return (
    <div className="SignUpPage">
      <FadeIn className="container">
        <h2>Sign up</h2>
        <AuthButtons />
        <sub>
          Already have an account? <a href="/signin">Sign in</a>
        </sub>
      </FadeIn>
    </div>
  );
};

export default SignUpPage;
