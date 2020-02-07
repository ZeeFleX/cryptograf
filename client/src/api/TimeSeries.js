import { API_ROOT } from "config/config";

export async function getCandles() {
  return new Promise((resolve, reject) => {
    fetch(
      `${API_ROOT}/candles?limit=1000&endTime=2019-02-01&indicators=ma,madirection,madcomplex&symbols=btcusdt,ethusdt,bnbusdt,bnbeth,ethbtc,bnbbtc`,
      {
        method: "get",
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }
    )
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
