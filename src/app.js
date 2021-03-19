import { WordsList } from "./WordsList";
export const initialWords = ["one", "two"];

export const initialState = {
  title: "Title 1",
  words: initialWords
};

export const app = new WordsList();

app._root = document.body;

app.forceUpdate();

window.app = app;
