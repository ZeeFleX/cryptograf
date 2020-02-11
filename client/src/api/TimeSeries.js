import { API_ROOT } from "config/config";
import querystring from "querystring";

export async function getCandles(symbol, startTime, endTime) {
  const query = querystring.encode({ symbol, startTime, endTime });
  return new Promise((resolve, reject) => {
    fetch(`${API_ROOT}/candles?${query}`, {
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
