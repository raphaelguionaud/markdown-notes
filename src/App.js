import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { defaultText } from "./default-text";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    const storageText = localStorage.getItem("text");
    const storageActiveTab = localStorage.getItem("activeTab");
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const text =
      storageText && storageText !== ""
        ? JSON.parse(storageText)
        : [defaultText, "", ""];
    const activeTab = storageActiveTab ? parseInt(storageActiveTab) : 0;

    this.state = { text: text, isMac: isMac, activeTab: activeTab };
  }

  onKeyDown = (event) => {
    const { nativeEvent, target } = event;

    if (nativeEvent.keyCode === 9) {
      nativeEvent.preventDefault();
      this.insertTab(target);
    }

    if (this.state.isMac) {
      if (nativeEvent.metaKey) {
        if (nativeEvent.keyCode === 83) {
          nativeEvent.preventDefault();
          this.save();
        } else if (nativeEvent.keyCode === 88) {
          nativeEvent.preventDefault();
          this.deleteLine(target);
        }
      }
    } else {
      if (nativeEvent.ctrlKey) {
        if (nativeEvent.keyCode === 83) {
          nativeEvent.preventDefault();
          this.save();
        } else if (nativeEvent.keyCode === 88) {
          nativeEvent.preventDefault();
          this.deleteLine(target);
        }
      }
    }
  };

  render() {
    const tabs = this.state.text.map((tab, index) => {
      return (
        <div
          key={index}
          className={this.state.activeTab === index ? "tab active" : "tab"}
          onClick={() => this.selectTab(index)}
        >
          <div className="tabtext">{tab.replace(/[^a-zA-Z0-9_ ]/g, "")}</div>
          <div
            className="delete"
            onClick={(event) => this.deleteTab(index, event)}
          >
            <svg
              width="10px"
              height="10px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 5L19 19M5 19L19 5"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      );
    });

    const newTabButton =
      this.state.text.length < 10 ? (
        <div className="tab newtab" onClick={() => this.newTab()}>
          <svg
            width="16px"
            height="16px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="m12.75 5c0-.41421-.3358-.75-.75-.75s-.75.33579-.75.75v6.25h-6.25c-.41421 0-.75.3358-.75.75s.33579.75.75.75h6.25v6.25c0 .4142.3358.75.75.75s.75-.3358.75-.75v-6.25h6.25c.4142 0 .75-.3358.75-.75s-.3358-.75-.75-.75h-6.25z"
              fill="#ffffff"
              fillRule="evenodd"
            />
          </svg>
        </div>
      ) : null;

    return (
      <div className="App" onKeyDown={this.onKeyDown}>
        <header className="App-header">
          <div className="tabs">
            {tabs}
            {newTabButton}
          </div>
          <section className="main">
            <div className="raw">
              <textarea
                onChange={this.handleChange}
                value={this.state.text[this.state.activeTab]}
                data-testid="textarea"
              ></textarea>
            </div>
            <div className="markdown-container">
              <Markdown remarkPlugins={[remarkGfm]} className="markdown">
                {this.state.text[this.state.activeTab]}
              </Markdown>
            </div>
          </section>
          <section className="save">
            <button onClick={() => this.save()}>Save</button>
          </section>
        </header>
      </div>
    );
  }

  handleChange = (event) => {
    let newStateText = this.state.text;
    newStateText[this.state.activeTab] = event.target.value;

    this.setState({
      text: newStateText,
    });
  };

  selectTab = (index) => {
    this.setState({
      activeTab: index,
    });
  };

  deleteTab = (index, event) => {
    event.stopPropagation();

    const newStateText = this.state.text;
    newStateText.splice(index, 1);

    let newIndex;

    if (
      this.state.activeTab !== index &&
      newStateText[this.state.activeTab] !== undefined
    ) {
      newIndex = this.state.activeTab;
    } else if (newStateText[index] !== undefined) {
      newIndex = index;
    } else {
      newIndex = index - 1;
    }

    this.setState({
      text: newStateText,
      activeTab: newIndex,
    });
  };

  newTab = () => {
    let newStateText = this.state.text;
    newStateText.push("");
    const index = newStateText.length - 1;

    this.setState({
      text: newStateText,
      activeTab: index,
    });
  };

  insertTab(target) {
    const { selectionStart, selectionEnd, value } = target;
    const newValue =
      value.substring(0, selectionStart) + "\t" + value.substring(selectionEnd);

    let newStateText = this.state.text;
    newStateText[this.state.activeTab] = newValue;

    this.setState({ text: newStateText }, () => {
      target.selectionStart = target.selectionEnd = selectionStart + 1;
    });
  }

  deleteLine(target) {
    const { selectionStart, value } = target;

    let textArray = value.split("\n");
    let count = 0;
    let startIndex;
    let newSelectionStart;

    for (let i = 0; i < textArray.length; i++) {
      if (i > 0) {
        count += 1;
      }

      count += textArray[i].length;

      if (startIndex == null && count >= selectionStart) {
        startIndex = i;
        if (newSelectionStart == null) {
          newSelectionStart = count - textArray[i].length;
        }
      }
    }

    if (startIndex != null) {
      textArray.splice(startIndex, 1);
    } else {
      // remove last line
      textArray.pop();
    }

    const newValue = textArray.join("\n");

    let newStateText = this.state.text;
    newStateText[this.state.activeTab] = newValue;

    this.setState({ text: newStateText }, () => {
      target.selectionStart = target.selectionEnd = newSelectionStart;
    });
  }

  save() {
    localStorage.setItem("activeTab", this.state.activeTab);
    localStorage.setItem("text", JSON.stringify(this.state.text));
  }
}

export default App;
