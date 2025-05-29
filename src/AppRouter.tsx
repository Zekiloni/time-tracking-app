import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth.tsx";
import Main from "./pages/Main.tsx";
import {useAuthStore} from "./core/user-store.ts";
import type {JSX} from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const user = useAuthStore((state) => state.user);
    return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: JSX.Element }) => {
    const user = useAuthStore((state) => state.user);
    return user ? <Navigate to="/" replace /> : children;
};

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Auth />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Main />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
