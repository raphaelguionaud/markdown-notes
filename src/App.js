import React from "react";
import Markdown from "react-markdown";
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
        : { text: "", isMac: isMac };
  }

  _onKeyDown = ({ nativeEvent }) => {
    if (this.state.isMac) {
      if (
        (nativeEvent.keyCode === 91 || nativeEvent.keyCode === 93) &&
        nativeEvent.keyCode === 83
      ) {
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
      <div className="App" onKeyDown={this._onKeyDown}>
        <header className="App-header">
          <section className="main">
            <div className="raw">
              <textarea
                onChange={this.handleChange}
                value={this.state.text}
              ></textarea>
            </div>
            <div className="markdown-container">
              <Markdown className="markdown">{this.state.text}</Markdown>
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

  // isUnorderedList(line) {
  //   return line.length > 2 && line[0] === "*" && line[1] === " ";
  // }

  // isOrderedList(line) {
  //   const pointIndex = line.indexOf(".");
  //   const spaceIndex = line.indexOf(" ");
  //   const substring = line.substring(0, pointIndex);

  //   if (
  //     pointIndex === -1 ||
  //     spaceIndex === -1 ||
  //     isNaN(substring) ||
  //     isNaN(parseFloat(substring))
  //   ) {
  //     return false;
  //   }

  //   return true;
  // }

  // isLargeHeading(line) {
  //   return line.length > 2 && line[0] === "#" && line[1] === " ";
  // }

  // isMediumHeading(line) {
  //   return (
  //     line.length > 3 && line[0] === "#" && line[1] === "#" && line[2] === " "
  //   );
  // }

  // isSmallHeading(line) {
  //   return (
  //     line.length > 4 &&
  //     line[0] === "#" &&
  //     line[1] === "#" &&
  //     line[2] === "#" &&
  //     line[3] === " "
  //   );
  // }

  // parseLine(line) {
  //   const stack = [];
  //   let res = [];

  //   for (let i = 0; i < line.length; i++) {
  //     const char = line.charAt(i);

  //     if (stack.length && stack[0] === "*") {
  //       if (char === "*") {
  //         stack.shift();
  //         let string = "";

  //         while (stack.length > 0) {
  //           string += stack.shift();
  //         }

  //         res.push(<i>{string}</i>);
  //         continue;
  //       } else {
  //         stack.push(char);
  //         continue;
  //       }
  //     }

  //     if (char === "*") {
  //       stack.push(char);
  //       continue;
  //     }

  //     res.push(char);
  //   }

  //   if (stack.length > 0) {
  //     res.push(stack.join(""));
  //   }

  //   return res;
  // }

  // textToMarkdown(text) {
  //   const lines = text.split("\n");

  //   return lines.map((line) => {
  //     if (line === "") {
  //       return <div>&nbsp;</div>;
  //     }

  //     if (this.isOrderedList(line)) {
  //       return (
  //         <ol>
  //           <li>{this.parseLine(line.slice(1))}</li>
  //         </ol>
  //       );
  //     }

  //     if (this.isUnorderedList(line)) {
  //       return (
  //         <ul>
  //           <li>{this.parseLine(line.slice(1))}</li>
  //         </ul>
  //       );
  //     }

  //     if (this.isLargeHeading(line)) {
  //       return <h1>{this.parseLine(line.slice(1))}</h1>;
  //     }

  //     if (this.isMediumHeading(line)) {
  //       return <h2>{this.parseLine(line.slice(2))}</h2>;
  //     }

  //     if (this.isSmallHeading(line)) {
  //       return <h3>{this.parseLine(line.slice(3))}</h3>;
  //     }

  //     return <div>{this.parseLine(line)}</div>;
  //   });
  // }

  save() {
    localStorage.setItem("text", this.state.text);
  }
}

export default App;
