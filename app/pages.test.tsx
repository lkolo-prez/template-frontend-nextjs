import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AboutPage from "./(marketing)/about/page";
import MarketingLayout from "./(marketing)/layout";
import RouteError from "./error";
import Loading from "./loading";
import NotFound from "./not-found";
import HomePage from "./page";

describe("app routes", () => {
  it("renders the home page", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "About this template" }),
    ).toHaveAttribute("href", "/about");
  });

  it("renders the about page inside the marketing layout", () => {
    render(
      <MarketingLayout>
        <AboutPage />
      </MarketingLayout>,
    );
    expect(screen.getByRole("heading", { name: "About" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("renders the not-found page", () => {
    render(<NotFound />);
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("renders the loading state", () => {
    render(<Loading />);
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("renders the error boundary and retries on click", async () => {
    const reset = vi.fn();
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const user = userEvent.setup();
    render(<RouteError error={new Error("boom")} reset={reset} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong");
    expect(screen.queryByText("boom")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(reset).toHaveBeenCalledOnce();
    spy.mockRestore();
  });
});
