import Cookies from "js-cookie";

export const removeSession = () => {
    Cookies.remove("session");
};

export const setSessionCookie = (session) => {
    removeSession();
    Cookies.set("session", JSON.stringify(session), { expires: 14 });
};

export const getSessionCookie = () => {
    const sessionCookie = Cookies.get("session");
    return sessionCookie ? JSON.parse(sessionCookie): null;
};