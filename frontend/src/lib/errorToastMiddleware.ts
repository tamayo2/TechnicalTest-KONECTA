
import {isRejectedWithValue, isFulfilled, type Middleware} from "@reduxjs/toolkit";
import toast from "react-hot-toast";
function extractErrorMessage(payload: any, fallback = "Error de servidor") {
    if (!payload) return fallback;
    const msg = payload?.data?.message || payload?.error || payload?.message;
    if (msg) return String(msg);
    const zodErr = payload?.data?.errors;
    if (Array.isArray(zodErr) && zodErr.length) {
        const first = zodErr[0];
        if (first?.message) return String(first.message);
    }
    return fallback;
}
export const errorToastMiddleware: Middleware =
    () => (next) => (action: unknown) => {

        if (isRejectedWithValue(action as any)) {
            const meta = (action as any).meta;
            const endpoint: string | undefined = meta?.arg?.endpointName;
            const isRefresh =
                endpoint === "refresh" || meta?.arg?.originalArgs?.url === "/auth/refresh";
            const isLogin = endpoint === "login";
            if (!isRefresh && !isLogin) {
                const payload = (action as any).payload ?? (action as any).error;
                const message = extractErrorMessage(payload);
                toast.error(message);
            }
        }
        if (
            isFulfilled(action as any) &&
            (action as any).meta?.arg?.type === "mutation"
        ) {
            const endpoint: string | undefined = (action as any).meta?.arg?.endpointName;
            if (endpoint && ["create", "update", "remove"].includes(endpoint)) {
                toast.success(
                    endpoint === "create"
                        ? "Creado correctamente"
                        : endpoint === "update"
                            ? "Actualizado correctamente"
                            : "Eliminado correctamente"
                );
            }
        }
        return next(action);
    };









