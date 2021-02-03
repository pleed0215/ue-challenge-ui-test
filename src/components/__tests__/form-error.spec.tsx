import { render } from "@testing-library/react";
import React from "react";
import { FormError } from "../form-error";

describe("<FormError />", () => {
  it("rendering OK with props...", () => {
    const { getByText, rerender } = render(<FormError errorMessage="test" />);
    getByText("test");
  });
});
