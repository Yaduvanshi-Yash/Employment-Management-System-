export const getStoredSession = () => {
  const persistentSession = localStorage.getItem("loggedinUser");
  const temporarySession = sessionStorage.getItem("loggedinUser");

  return persistentSession || temporarySession;
};

export const setStoredSession = (sessionData, rememberMe = false) => {
  const serializedSession = JSON.stringify(sessionData);

  if (rememberMe) {
    localStorage.setItem("loggedinUser", serializedSession);
    sessionStorage.removeItem("loggedinUser");
    return;
  }

  sessionStorage.setItem("loggedinUser", serializedSession);
  localStorage.removeItem("loggedinUser");
};

export const clearStoredSession = () => {
  localStorage.removeItem("loggedinUser");
  sessionStorage.removeItem("loggedinUser");
};

export const isPersistentSession = () => Boolean(localStorage.getItem("loggedinUser"));

export const getStoredToken = () => {
  const storedSession = getStoredSession();
  if (!storedSession) {
    return null;
  }

  try {
    const parsedSession = JSON.parse(storedSession);
    return parsedSession.token || null;
  } catch {
    return null;
  }
};
