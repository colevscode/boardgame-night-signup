import React from "react";
import StretchyInput from "./StretchyInput";

export default class Survey extends React.Component {
  render() {
    return (
      <form action="https://formspree.io/mddryokm" method="POST">
        <label>
          <div className="left">Yes! My name is:</div>
          <div className="right">
            <input
              className="underlined survey"
              placeholder="Name  (required)"
              type="text"
              name="_name"
              required
            />{" "}
          </div>
        </label>
        <label>
          <div className="left">Hit me up at: </div>
          <div className="right">
            <input
              className="underlined survey"
              placeholder="Email  (requred)"
              type="email"
              name="_replyto"
              required
            />
          </div>
        </label>
        <label>
          <div className="left">I prefer to meet: </div>
          <div className="right">
            <select name="hood" className="underlined survey">
              <option value="les">at Oribital</option>
              <option value="bkln">in Boerum Hill</option>
              <option value="both">wherever</option>
            </select>
          </div>
        </label>
        <label>
          <div className="left">I'm available: </div>
          <div>
            <input
              className="underlined survey block"
              placeholder="Which days? (eg: thurs nights)  (required)"
              type="text"
              name="avail"
              required
            />{" "}
          </div>
        </label>
        <label>
          <div className="left">I'm in to: </div>
          <div>
            <input
              className="underlined survey block"
              placeholder="Genres"
              type="text"
              name="genres"
            />
          </div>
        </label>
        <label>
          <div className="left">I have some games I can bring, like: </div>
          <div>
            <input
              className="underlined survey block"
              placeholder="My games"
              type="text"
              name="games"
            />
          </div>
        </label>
        <div>Thanks!</div>
        <input type="submit" />
      </form>
    );
  }
}
