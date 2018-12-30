import React from "react";
import { render } from "react-dom";

const LABEL_BUFFER = 1.25; // Some extra space for label wrapping
const VALUE_BUFFER = 0.75; // Eagerly wrap value

function setCaretPos(node, pos) {
  const sel = window.getSelection();
  const range = document.createRange();
  range.setStart(node, pos);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

function insertCaret(el) {
  let node;
  if (!el.childNodes.length) {
    node = window.document.createTextNode("");
    el.appendChild(node);
  } else {
    node = el.childNodes[0];
    if (node.textContent != "") {
      return;
    }
  }
  setCaretPos(node, node.childNodes.length);
}

function updateTextPreserveCaret(el, text) {
  if (!text) {
    return;
  }
  const sel = window.getSelection();
  let pos = sel.anchorOffset;
  el.innerText = text;
  // if (sel.anchorNode) {
  //   setCaretPos(sel.anchorNode, pos);
  //   return;
  //   // pos = el.childNodes[0].textContent.length;
  // }
  setCaretPos(el.childNodes[0], text.length);
}

export default class StretchyInput extends React.Component {
  constructor(props) {
    super(props);

    this.minPadding = props.padding;
    this.state = {
      value: "",
      flipped: false,
      wrapped: false,
      lastCut: 0,
      lastLineHeight: 0,
      lastLabelWidth: 0
    };

    this.update = this.update.bind(this);
    this.makeMeasurements = this.makeMeasurements.bind(this);
    this.checkWrapped = this.checkWrapped.bind(this);
    this.disableEnter = this.disableEnter.bind(this);

    this.root = React.createRef();
    this.editableSpan = React.createRef();
    this.labelSpan = React.createRef();
  }

  componentDidMount() {
    this.editableSpan.current.addEventListener("input", this.update);
    this.editableSpan.current.addEventListener("keydown", this.disableEnter);
    this.editableSpan.current.addEventListener("keyup", this.disableEnter);
    window.addEventListener("resize", this.checkWrapped);
    this.checkWrapped();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.value != this.state.value) {
      this.checkWrapped();
    }
  }

  componentWillUnmount() {
    this.editableSpan.current.removeEventListener("input", this.update);
    this.editableSpan.current.removeEventListener("keydown", this.disableEnter);
    this.editableSpan.current.removeEventListener("keyup", this.disableEnter);
    window.removeEventListener("resize", this.checkWrapped);
  }

  makeMeasurements(label, value) {
    // append temp div to perform measurements
    const tempDiv = window.document.createElement("div");
    tempDiv.style = "visibility: hidden; position: fixed; width: 10000px";
    this.root.current.appendChild(tempDiv);

    // measure label width
    let labelWidth;
    if (!this.state.lastLabelWidth) {
      render(this.renderLabel(label, false, false, this.minPadding), tempDiv);
      labelWidth = tempDiv.querySelector("span").offsetWidth;
    } else {
      labelWidth = this.state.lastLabelWidth;
    }

    // measure span
    render(this.renderInputSpan(true, this.minPadding), tempDiv);
    let editableSpan = tempDiv.querySelector("span [contenteditable]");
    let containerSpan = tempDiv.querySelector("span");
    editableSpan.innerText = value;
    let spanHeight = containerSpan.offsetHeight;
    let flipped, cut;
    if (containerSpan.offsetWidth <= labelWidth) {
      flipped = false;
      cut = 0;
    } else if (this.state.lastCut > 0) {
      // editableSpan width was already larger than labelWidth
      // use previously calculated cut-off
      flipped = true;
      cut = this.state.lastCut;
    } else {
      // editableSpan width has become greater than labelWidth
      // calculate the no-wrap cut-off
      flipped = true;
      for (cut = 1; cut <= value.length; cut++) {
        editableSpan.innerText = value.slice(0, cut);
        if (containerSpan.offsetWidth * LABEL_BUFFER > labelWidth) {
          break;
        }
      }
    }
    tempDiv.remove();
    return [flipped, cut, spanHeight, labelWidth];
  }

  update(ev) {
    const el = ev.target;
    const text = el.innerText;
    const sanitized = text.replace("\n", "");
    const [flipped, cut, spanHeight, labelWidth] = this.makeMeasurements(
      this.props.label,
      sanitized
    );
    let displayStr = sanitized;
    if (cut) {
      displayStr =
        sanitized.slice(0, cut).replace(" ", "\u00A0") + sanitized.slice(cut);
    }
    if (text !== displayStr) {
      updateTextPreserveCaret(el, displayStr);
    }
    this.setState({
      value: sanitized,
      flipped: flipped,
      lastCut: cut,
      lastLineHeight: spanHeight,
      lastLabelWidth: labelWidth
    });
  }

  checkWrapped() {
    const root = this.root.current;
    const container = root.offsetParent;

    const label = this.labelSpan.current;
    // console.log("checking", this.state, editable.offsetLeft);
    if (this.state.flipped) {
      const labelShouldWrap =
        container.offsetWidth - root.offsetLeft <
        label.offsetWidth * LABEL_BUFFER;
      if (labelShouldWrap) {
        label.style.left = -root.offsetLeft + "px";
        label.style.top =
          this.state.lastLineHeight * 2 + label.offsetHeight - 10 + "px";
      } else {
        label.style.left = "0px";
        label.style.top = "17px";
      }
    } else {
      // not flipped
      // const editableParent = this.editableSpan.current.offsetParent;
      // const spanShouldWrap =
      //   container.offsetWidth - root.offsetLeft < editableParent.offsetWidth;

      // if (spanShouldWrap) {
      //   editableParent.style.left = -root.offsetLeft + "px";
      //   editableParent.style.top = this.state.lastLineHeight * 3 - 10 + "px";
      // }
      label.style.top = "15px";
    }
  }

  disableEnter(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  }

  renderLabel(label, flipped, wrapped, padding, ref) {
    return (
      <span
        className={
          "label " + (flipped ? "flipped " : "") + (wrapped ? "wrapped" : "")
        }
        style={{ padding: `0 ${padding}px` }}
        ref={ref}
      >
        {label}
      </span>
    );
  }

  renderInputSpan(flipped, padding, ref) {
    return (
      <span>
        <span
          className={"input " + (flipped ? "flipped" : "")}
          style={{ paddingLeft: padding }}
          ref={ref}
          suppressContentEditableWarning={true}
          contentEditable
        />
        <span
          style={{ paddingRight: padding }}
          className={"trailing " + (flipped ? "flipped" : "")}
        />
      </span>
    );
  }

  render() {
    const { className, type, label, padding, ...other } = this.props;
    const { flipped, wrapped, value } = this.state;
    return (
      <span
        className={"StretchyInput " + className}
        ref={this.root}
        onClick={() => {
          insertCaret(this.editableSpan.current);
        }}
      >
        {flipped
          ? this.renderLabel(
              label,
              flipped,
              wrapped,
              this.minPadding,
              this.labelSpan
            )
          : ""}
        {this.renderInputSpan(flipped, this.minPadding, this.editableSpan)}
        {flipped
          ? ""
          : this.renderLabel(
              label,
              flipped,
              wrapped,
              this.minPadding,
              this.labelSpan
            )}
        <input
          ref={this.input}
          type={type || "text"}
          value={value.replace("\u00A0", " ")}
          readOnly
          {...other}
        />
      </span>
    );
  }
}
