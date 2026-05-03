import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";
import apiClient from "../services/apiClient.js";

vi.mock("../services/apiClient");

function TestComponent() {
  const { isAuthenticated, user, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? "authenticated" : "unauthenticated"}</span>
      <span data-testid="username">{user?.username ?? "none"}</span>
      <button onClick={() => login("test@example.com", "password")}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

function renderWithAuth() {
  return render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null);
    vi.spyOn(Storage.prototype, "setItem");
    vi.spyOn(Storage.prototype, "removeItem");
  });

  it("starts authenticated when token exists in localStorage", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      if (key === "accessToken") return "existing-token";
      return null;
    });
    renderWithAuth();
    expect(screen.getByTestId("auth-status")).toHaveTextContent("authenticated");
  });

  it("starts unauthenticated when no token in localStorage", () => {
    renderWithAuth();
    expect(screen.getByTestId("auth-status")).toHaveTextContent("unauthenticated");
  });

  it("sets authenticated state after login", async () => {
    vi.mocked(apiClient.post).mockResolvedValueOnce({
      data: {
        token: "access-token",
        refreshToken: "refresh-token",
        id: "123",
        email: "test@example.com",
        username: "testuser",
      },
    });

    renderWithAuth();

    await act(async () => {
      screen.getByText("Login").click();
    });

    expect(screen.getByTestId("auth-status")).toHaveTextContent("authenticated");
    expect(screen.getByTestId("username")).toHaveTextContent("testuser");
    expect(localStorage.getItem("accessToken")).toBe("access-token");
  });

  it("clears state after logout", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      if (key === "accessToken") return "existing-token";
      if (key === "refreshToken") return "existing-refresh-token";
      return null;
    });

    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: {} });

    renderWithAuth();

    // Verify authenticated before logout
    expect(screen.getByTestId("auth-status")).toHaveTextContent("authenticated");

    await act(async () => {
      screen.getByText("Logout").click();
    });

    // Verify unauthenticated after logout
    expect(screen.getByTestId("auth-status")).toHaveTextContent("unauthenticated");
    expect(screen.getByTestId("username")).toHaveTextContent("none");
  });
});