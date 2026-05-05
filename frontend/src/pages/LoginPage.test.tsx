// src/pages/LoginPage.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "./LoginPage.js";
import * as AuthContext from "../context/AuthContext.js";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderLoginPage(isAuthenticated = false) {
  const mockLogin = vi.fn();
  vi.spyOn(AuthContext, "useAuth").mockReturnValue({
    isAuthenticated,
    user: null,
    accessToken: null,
    login: mockLogin,
    logout: vi.fn(),
  });

  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );

  return { mockLogin };
}

describe("LoginPage", () => {
  it("renders email and password fields", () => {
    renderLoginPage();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("calls login with email and password on submit", async () => {
    const { mockLogin } = renderLoginPage();
    mockLogin.mockResolvedValueOnce(undefined);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
    });
  });

  it("redirects to dashboard on successful login", async () => {
    const { mockLogin } = renderLoginPage();
    mockLogin.mockResolvedValueOnce(undefined);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows error message on failed login", async () => {
    const { mockLogin } = renderLoginPage();
    mockLogin.mockRejectedValueOnce(new Error("Invalid credentials"));

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });
});