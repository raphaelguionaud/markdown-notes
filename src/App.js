import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { defaultText } from "./default-text";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    const storage = localStorage.getItem("text");
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;

    this.state =
      storage && storage !== ""
        ? {
            text: storage,
            isMac: isMac,
          }
        : { text: defaultText, isMac: isMac };
  }

  onKeyDown = (event) => {
    const { nativeEvent, target } = event;

    if (nativeEvent.keyCode === 9) {
      nativeEvent.preventDefault();

      const { selectionStart, selectionEnd, value } = target;
      const newValue =
        value.substring(0, selectionStart) +
        "\t" +
        value.substring(selectionEnd);

      this.setState({ text: newValue }, () => {
        target.selectionStart = target.selectionEnd = selectionStart + 1;
      });
    }

    if (this.state.isMac) {
      if (nativeEvent.metaKey && nativeEvent.keyCode === 83) {
        nativeEvent.preventDefault();
        this.save();
      }
    } else {
      if (nativeEvent.ctrlKey && nativeEvent.keyCode === 83) {
        nativeEvent.preventDefault();
        this.save();
      }
    }
  };

  render() {
    return (
      <div className="App" onKeyDown={this.onKeyDown}>
        <header className="App-header">
          <section className="main">
            <div className="raw">
              <textarea
                onChange={this.handleChange}
                value={this.state.text}
                data-testid="textarea"
              ></textarea>
            </div>
            <div className="markdown-container">
              <Markdown remarkPlugins={[remarkGfm]} className="markdown">
                {this.state.text}
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
    this.setState({
      text: event.target.value,
    });
  };

  save() {
    localStorage.setItem("text", this.state.text);
  }
}

export default App;
