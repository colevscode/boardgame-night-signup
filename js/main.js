import React from "react";
import ReactDOM from "react-dom";
import Madlib from "./Madlib";
import Survey from "./Survey";

const { detect } = require("detect-browser");
const browser = detect();

class Layout extends React.Component {
  render() {
    return (
      <>
        <div className="image-bg" />
        <div className="site-frame">
          <div className="content">
            <h1>Let's play some board games!</h1>
            {browser && browser.name === "chrome" ? <Madlib /> : <Survey />}
          </div>
        </div>
      </>
    );
  }
}

function bootstrap() {
  ReactDOM.render(<Layout />, document.getElementById("app-container"));
  window.addEventListener("resize", ev => {
    console.log(
      document.querySelector("span.label").innerText,
      document.querySelector("span.label").offsetLeft,
      document.querySelector("span.input").offsetLeft
    );
  });
}

window.addEventListener("load", bootstrap);
