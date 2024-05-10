import apiKit from "./ApiKit";

class LocalStorageKit {
  STORAGE_TOKEN_KEY = "STORAGE_TOKEN_KEY";
  STORAGE_USERNAME_KEY = "username";

  setTokenInStorage(tokens) {
    if (!tokens || !tokens.access) {
      // console.error("Invalid token structure:", tokens);
      return;
    }
    localStorage.setItem(this.STORAGE_TOKEN_KEY, JSON.stringify(tokens));
    apiKit.defaults.headers.common["Authorization"] = `Bearer ${tokens.access}`;
  }

  getTokenFromStorage() {
    const token = localStorage.getItem(this.STORAGE_TOKEN_KEY);
    if (token) {
      const parsedToken = JSON.parse(token);
      apiKit.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${parsedToken?.access}`;
      return parsedToken;
    }
    return null;
  }

  deleteTokenFromStorage() {
    localStorage.removeItem(this.STORAGE_TOKEN_KEY);
    apiKit.defaults.headers.common["Authorization"] = "";
  }

  setUsernameInStorage(username) {
    localStorage.setItem(this.STORAGE_USERNAME_KEY, username);
  }

  getUsernameFromStorage() {
    return localStorage.getItem(this.STORAGE_USERNAME_KEY);
  }
}

const localStorageKit = new LocalStorageKit();
export default localStorageKit;
