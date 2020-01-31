import { observable, action, computed } from "mobx";
import { loginAction, restoreSessionAction } from "../api/User";

class UserStore {
  // Properties
  @observable data = {};

  // Getters
  @computed get isLoggedIn() {
    return this.data.id ? true : false;
  }
  //Actions
  @action async login(credentials = {}) {
    const user = await loginAction(credentials);
    this.data = user;
    window.localStorage.setItem("token", user.token);
  }

  @action logout() {
    window.localStorage.removeItem("token");
    this.data = {};
  }

  @action async restoreSession(token) {
    const user = await restoreSessionAction(token);
    this.data = {
      ...user,
      token
    };
  }
}

const store = new UserStore();
export default store;
