import UI from "stores/UI.store";
import { API_ROOT } from "../config/config";

export async function getLogsAction() {
  UI.startLoading();
  return new Promise((resolve, reject) => {
    fetch(`${API_ROOT}/logs`, {
      method: "get",
      headers: {
        Authorization: localStorage.getItem("token"),
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then(Response => {
        UI.finishLoading();
        return Response.json();
      })
      .then(Response => {
        const logs = Response.logs;
        resolve(logs);
      })
      .catch(err => {
        reject(err);
      });
  });
}
