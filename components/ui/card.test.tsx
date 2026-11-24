import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./card";

describe("Card", () => {
  it("renders children and merges class names", () => {
    render(
      <Card className="custom" data-testid="card">
        Content
      </Card>,
    );
    const card = screen.getByTestId("card");
    expect(card).toHaveTextContent("Content");
    expect(card).toHaveClass("custom");
    expect(card).toHaveClass("border");
  });
});
