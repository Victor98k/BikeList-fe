import apiKit from "./ApiKit";

class LocalStorageKit {
  STORAGE_TOKEN_KEY = "STORAGE_TOKEN_KEY";
  STORAGE_USERNAME_KEY = "username";

  setTokenInStorage(token) {
    console.log("Setting token in storage:", token); // This will confirm what you are trying to store
    localStorage.setItem(this.STORAGE_TOKEN_KEY, token);
    apiKit.defaults.headers.common["Authorization"] = `Bearer ${token}`;
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
