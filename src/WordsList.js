import { Component } from "./Component";

export const initialWords = ["one", "two"];

export const initialState = {
  title: "Title 1",
  words: initialWords
};

export class WordsList extends Component {
  constructor() {
    super();

    this.state = initialState;
  }

  showWords() {
    return this.state.words.join("_");
  }

  addWord(word) {
    this.setState({
      words: [...this.state.words, word]
    });
  }

  setTitle(title) {
    this.setState({
      title
    });
  }

  render() {
    return `<div>
    <h1>${this.state.title}</h1>
    <ul>
      ${this.state.words.map((word) => "<li>" + word + "</li>").join("")}
    </ul>
  </div>`;
  }
}
