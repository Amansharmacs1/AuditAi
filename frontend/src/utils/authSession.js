const TOKEN_KEY = "token";
const EMAIL_KEY = "userEmail";
const EXPIRES_AT_KEY = "authExpiresAt";

export const setSessionAuth = ({
  token,
  email,
  expiresAt,
}) => {
  if (!token || !email) return;

  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(EMAIL_KEY, email);

  if (expiresAt) {
    sessionStorage.setItem(
      EXPIRES_AT_KEY,
      String(expiresAt)
    );
  }
};

export const clearSessionAuth = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(EMAIL_KEY);
  sessionStorage.removeItem(EXPIRES_AT_KEY);
};

export const getSessionToken = () =>
  sessionStorage.getItem(TOKEN_KEY);

export const getSessionEmail = () =>
  sessionStorage.getItem(EMAIL_KEY);

export const isSessionAuthenticated = () => {
  const token = getSessionToken();
  const email = getSessionEmail();
  const expiresAt = Number(
    sessionStorage.getItem(EXPIRES_AT_KEY)
  );

  if (!token || !email) return false;

  if (expiresAt && Date.now() > expiresAt) {
    clearSessionAuth();
    return false;
  }

  return true;
};
