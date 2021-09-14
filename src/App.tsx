import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { useStore } from "react-hookstore";

import Logo from "components/Logo/Logo";
import ChatPage from "pages/ChatPage/ChatPage";
import IndexRoute from "pages/IndexRoute/IndexRoute";

import "./App.scss";
import "utils/store";
import "utils/firebase";

function App() {
  const [loading] = useStore<boolean>("loading");

  return (
    <div className="App">
      <div className={`splashscreen ${loading ? "splashscreenLoading" : ""}`}>
        <Logo />
        <div className="loader">
          <BeatLoader color="var(--brand-primary0)" size={12} margin={5} />
        </div>
      </div>
      <div className={`content ${loading ? "contentLoading" : ""}`}>
        <Router>
          <Switch>
            <Route exact path="/w/:username" component={ChatPage} />
            <Route path="/" component={IndexRoute} />
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
