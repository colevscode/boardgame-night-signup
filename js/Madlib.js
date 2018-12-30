import React from "react";
import StretchyInput from "./StretchyInput";

export default class Madlib extends React.Component {
  render() {
    return (
      <form action="https://formspree.io/mddryokm" method="POST">
        <p>
          My name is{" "}
          <StretchyInput
            className="underlined"
            label="Name  (required)"
            padding={15}
            type="text"
            name="_name"
            required
          />{" "}
          and I'd love to play! I'm available{" "}
          {/* <select name="day" className="underlined">
            <option value="mon">Monday Nights</option>
            <option value="tue">Tuesday Nights</option>
            <option value="wed">Wednesday Nights</option>
            <option value="thu">Thursday Nights</option>
            <option value="fri">Friday Nights</option>
            <option value="sat">Saturdays</option>
            <option value="sun">Sundays</option>
          </select> */}
          <StretchyInput
            className="underlined"
            label="Which Days?  (required)"
            padding={15}
            type="text"
            name="avail"
            placeholder="ex: thursday evenings"
            required
          />{" "}
          . I prefer to meet{" "}
          <select name="hood" className="underlined">
            <option value="les">at Oribital</option>
            <option value="bkln">in Boerum Hill</option>
            <option value="both">wherever</option>
          </select>
          . I'm in to{" "}
          <StretchyInput
            className="underlined"
            label="Genres"
            padding={15}
            type="text"
            name="genres"
          />
          . I have some games I can bring, like{" "}
          <StretchyInput
            className="underlined"
            label="My games"
            padding={15}
            type="text"
            name="games"
          />
          .
        </p>{" "}
        <p>
          Hit me up at{" "}
          <StretchyInput
            className="underlined"
            label="Email  (requred)"
            padding={15}
            type="email"
            name="_replyto"
            required
          />
          .
        </p>
        <input type="submit" />
      </form>
    );
  }
}
