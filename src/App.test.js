import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { defaultText } from "./default-text";
import { testList } from "./markdown-test";
import App from "./App";
import userEvent from "@testing-library/user-event";

afterEach(cleanup);

test("textarea should have correct initial text", () => {
  render(<App />);
  const textarea = screen.getByTestId("textarea");
  expect(textarea.value).toStrictEqual(defaultText);
});

test("tab should add /t whitespace to textarea", () => {
  render(<App />);
  const textarea = screen.getByTestId("textarea");

  fireEvent.change(textarea, { target: { value: "" } });
  fireEvent.keyDown(textarea, { key: "Tab", keyCode: 9 });

  expect(textarea.value).toStrictEqual("\t");
});

for (const item of testList) {
  test(`"${item.text}" <${item.element}> should be rendered`, () => {
    render(<App />);
    const markdown = screen.getByText(item.text);
    expect(markdown).toBeTruthy();
  });
}
