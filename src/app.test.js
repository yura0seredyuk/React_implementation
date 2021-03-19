import { app, initialWords, initialState } from "./app";
import { WordsList } from "./WordsList";
import { Component } from "./Component";

describe("JS app with React-like state", () => {
  it("`showWords` method returns all the `state.words` joined with `-`", () => {
    expect(app.showWords()).toBe("one_two");
  });

  it("addWord method should add new words to the state.words", () => {
    app.addWord("three");
    app.addWord("four");

    expect(app.showWords()).toBe("one_two_three_four");
  });

  it("addWord method should not change initialWords. DON’T mutate the state.words", () => {
    expect(initialWords).toEqual(["one", "two"]);
  });

  it("addWord method should not change the initialState. DON’T mutate the state object when adding new words.", () => {
    expect(initialState).toEqual(
      expect.objectContaining({
        words: ["one", "two"]
      })
    );
  });

  it("addWord method should preserve all the fields in the state (it should work for any other field not only title)", () => {
    expect(initialState).toEqual({
      title: "Title 1",
      words: ["one", "two"]
    });
  });

  it("setTitle method should change the title in the state to a given value", () => {
    app.setTitle("42");

    expect(app.state).toEqual(
      expect.objectContaining({
        title: "42"
      })
    );
  });

  it("render method should return a string containing a div with the markup representind a current app.state.", () => {
    app.setTitle("Hello, Mate");
    app.addWord("five");

    expect(app.render().replace(/\s+/g, "")).toEqual(
      `
      <div>
        <h1>Hello, Mate</h1>
        <ul>
          <li>one</li>
          <li>two</li>
          <li>three</li>
          <li>four</li>
          <li>five</li>
        </ul>
      </div>
    `.replace(/\s+/g, "")
    );
  });

  it("forceUpdate method should add the result of the render as document.body.innerHTML.", () => {
    app.forceUpdate();

    const title$ = document.querySelector("h1");
    const list$ = document.querySelector("ul");
    const items$ = [...list$.querySelectorAll("li")];

    expect(title$.textContent).toBe("Hello, Mate");
    expect(items$.length).toBe(5);
    expect(items$.map(({ textContent }) => textContent)).toEqual([
      "one",
      "two",
      "three",
      "four",
      "five"
    ]);
  });

  it("setState method should accept an object as a first argument and saving all its fields to the state.", () => {
    app.setState({
      title: "Tom",
      words: ["Jane"]
    });

    expect(app.state).toEqual(
      expect.objectContaining({
        title: "Tom",
        words: ["Jane"]
      })
    );

    const title$ = document.querySelector("h1");
    const list$ = document.querySelector("ul");
    const items$ = [...list$.querySelectorAll("li")];

    expect(title$.textContent).toBe("Tom");
    expect(items$.length).toBe(1);
    expect(items$.map(({ textContent }) => textContent)).toEqual(["Jane"]);
  });

  it("`addWord` and `setTitle` should use the `setState` instead of changing the `state` directly", () => {
    app.setState({
      title: "",
      words: []
    });

    app.setTitle("Tom");
    app.addWord("Jane");

    expect(app.state).toEqual(
      expect.objectContaining({
        title: "Tom",
        words: ["Jane"]
      })
    );

    const title$ = document.querySelector("h1");
    const list$ = document.querySelector("ul");
    const items$ = [...list$.querySelectorAll("li")];

    expect(title$.textContent).toBe("Tom");
    expect(items$.length).toBe(1);
    expect(items$.map(({ textContent }) => textContent)).toEqual(["Jane"]);
  });

  describe("WordsList", () => {
    beforeEach(() => {
      const rootDiv = document.querySelector("body > div#root");

      if (!rootDiv) {
        document.body.innerHTML = `<div id="root"></div>`;
      }
    });

    it("should create objects working the same way as the app before.", () => {
      const wordsList = new WordsList();

      const root = document.querySelector("#root");

      wordsList._root = root;

      wordsList.setState({
        tittle: "",
        words: []
      });

      wordsList.setTitle("Title 2");
      wordsList.addWord("name");

      expect(wordsList.state).toEqual(
        expect.objectContaining({
          title: "Title 2",
          words: ["name"]
        })
      );

      const title$ = root.querySelector("h1");
      const list$ = root.querySelector("ul");
      const items$ = [...list$.querySelectorAll("li")];

      expect(title$.textContent).toBe("Title 2");
      expect(items$.length).toBe(1);
      expect(items$.map(({ textContent }) => textContent)).toEqual(["name"]);
    });
  });

  describe("Component", () => {
    it("should have `setState`, `forceUpdate` methods", () => {
      expect(Component.prototype.setState).toBeInstanceOf(Function);
      expect(Component.prototype.forceUpdate).toBeInstanceOf(Function);
    });

    it("WordsList should not have `setState`, `forceUpdate` methods", () => {
      expect(new WordsList().hasOwnProperty("setState")).toBe(false);
      expect(new WordsList().hasOwnProperty("forceUpdate")).toBe(false);
    });

    it("WordsList should have `setState`, `forceUpdate` methods in the parent prototype", () => {
      expect(WordsList.prototype.__proto__.setState).toBeInstanceOf(Function);
      expect(WordsList.prototype.__proto__.forceUpdate).toBeInstanceOf(
        Function
      );
    });

    it("shoud be available to extend by Counter component", () => {
      const rootDiv = document.querySelector("body > div#counter");

      if (!rootDiv) {
        document.body.innerHTML = `<div id="counter"></div>`;
      }

      class Counter extends Component {
        constructor() {
          super();

          this.state = {
            count: 0
          };
        }

        increase() {
          this.setState({ count: this.state.count + 1 });
        }

        decrease() {
          this.setState({ count: this.state.count - 1 });
        }

        render() {
          return `Count: ${this.state.count}`;
        }
      }

      const counter = new Counter();

      const root = document.querySelector("#counter");

      counter._root = root;
      counter.forceUpdate();

      expect(root.textContent).toBe("Count: 0");

      counter.increase();

      expect(root.textContent).toBe("Count: 1");

      counter.increase();

      expect(root.textContent).toBe("Count: 2");

      counter.decrease();

      expect(root.textContent).toBe("Count: 1");
    });
  });
});
