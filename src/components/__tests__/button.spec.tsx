import { render } from "@testing-library/react";
import React from "react";
import { Button } from "../button";
import "@testing-library/jest-dom/extend-expect";

describe("<Button/>", () => {
  it("render actionText with loading false", () => {
    const { getByText } = render(
      <Button canClick={true} loading={false} actionText="test" />
    );
    getByText("test");
  });
  it("render Loading with loading true", () => {
    const { getByText } = render(
      <Button canClick={true} loading={true} actionText="test" />
    );
    getByText("Loading...");
  });
  it("render Loading with loading true", () => {
    const { getByText, container } = render(
      <Button canClick={false} loading={true} actionText="test" />
    );
    expect(container.firstChild).toHaveClass("pointer-events-none");
  });
});
