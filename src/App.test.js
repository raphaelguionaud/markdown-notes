import { screen } from "@testing-library/react";
import renderer from "react-test-renderer";
import App from "./App";
import userEvent from "@testing-library/user-event";
import { defaultText } from "./default-text";

it("re-renders markdown when the content changes", () => {
  const component = renderer.create(<App></App>);
  const textarea = screen.getByRole("textbox");

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  userEvent.type(textarea, "", { allAtOnce: true });

  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  userEvent.type(textarea, defaultText);

  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
