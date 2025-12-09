import { render, screen } from "@testing-library/react";
import App from "./App";

test("Affiche le conteneur de carte", () => {
  render(<App />);
  const mapContainer = screen.getByTestId("map-container");
  expect(mapContainer).toBeInTheDocument();
});
