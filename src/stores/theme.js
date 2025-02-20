import { persistentAtom } from "@nanostores/persistent";

const isBrowser = typeof window !== "undefined" && typeof localStorage !== "undefined";

const getStoredTheme = () => {

    if (!isBrowser) return null;
    return localStorage.getItem("theme");

};

const prefersDark = isBrowser ? window.matchMedia("(prefers-color-scheme: dark)").matches : false;

const savedTheme = getStoredTheme();
const defaultTheme = savedTheme ? savedTheme : prefersDark ? "dark" : "light";

export const theme = persistentAtom("theme", defaultTheme);

export function toggleTheme() {

    const newTheme = theme.get() === "dark" ? "light" : "dark";
    theme.set(newTheme);

    if (isBrowser) {
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    }
}

export function setAutoTheme() {

    if (isBrowser) {
        localStorage.removeItem("theme");
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        theme.set(systemTheme);
        document.documentElement.setAttribute("data-theme", systemTheme);
    }

}

if (isBrowser) {

    document.documentElement.setAttribute("data-theme", theme.get());

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {

        if (!getStoredTheme()) {
            const systemTheme = e.matches ? "dark" : "light";
            theme.set(systemTheme);
            document.documentElement.setAttribute("data-theme", systemTheme);
        }
        
    });
}
