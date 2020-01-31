import UI from "stores/UI.store";
import { API_ROOT } from "config/config";

export async function loginAction(credentials) {
  UI.startLoading();
  return new Promise((resolve, reject) => {
    fetch(`${API_ROOT}/login`, {
      method: "post",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(credentials)
    })
      .then(Response => {
        UI.finishLoading();
        return Response.json();
      })
      .then(Response => {
        if (!Response.error) {
          const user = Response.user;
          resolve(user);
        } else {
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}

export async function restoreSessionAction(token) {
  UI.startLoading();
  return new Promise((resolve, reject) => {
    fetch(`${API_ROOT}/getUserByToken`, {
      method: "post",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({ token })
    })
      .then(Response => {
        UI.finishLoading();
        return Response.json();
      })
      .then(Response => {
        resolve(Response.user);
      })
      .catch(err => {
        reject(err);
      });
  });
}
