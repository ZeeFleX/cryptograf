import { API_ROOT } from "config/config";

export async function getCandles() {
  return new Promise((resolve, reject) => {
    fetch(`${API_ROOT}/candles?limit=250&indicators=ma`, {
      method: "get",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then(Response => {
        return Response.json();
      })
      .then(Candles => {
        resolve(Candles);
      })
      .catch(err => {
        reject(err);
      });
  });
}
