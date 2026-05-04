import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.js";
import * as AuthContext from "../../context/AuthContext.js";

function renderWithRouter(isAuthenticated: boolean) {
  vi.spyOn(AuthContext, "useAuth").mockReturnValue({
    isAuthenticated,
    user: null,
    accessToken: null,
    login: vi.fn(),
    logout: vi.fn()
  });

  return render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <div>Dashboard</div>
          </ProtectedRoute>
        }/>
      </Routes>
    </MemoryRouter>
  );
}

describe("ProtectedRoute", () => {
  it("renders children when authenticated", () => {
    renderWithRouter(true);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("redirects to Login when unauthenticated", () => {
    renderWithRouter(false);
    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });
});