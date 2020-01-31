const BinanceAPI = require("node-binance-api")().options({
  APIKEY: "kOvSD6k2Bo0f4hPCXZn1lAm7zIRLPKifXEMVDYWEJvqw0xBwBU90htJbbgus9xnF",
  APISECRET: "PIDiAlnpX0nzP0qlqYTMbhoW5v4DadHjFQmwfgxdhumk4bMV9iPjyNyCx84h1Ho5",
  useServerTime: true // If you get timestamp errors, synchronize to server time at startup
});
const moment = require("moment");
const db = require("../models");

class Binance {
  constructor() {}
  // Подписываемся на обновления значений текущей свечи
  candlesSubscribe(symbol) {
    try {
      BinanceAPI.websockets.chart(
        "ETHBTC",
        "1h",
        async (symbol, interval, chart) => {
          const candlesArray = Object.entries(chart);
          const currentCandleArray = candlesArray[candlesArray.length - 1];

          // Попытка обновить существующую свечу в базе
          const result = await db.Candle.update(currentCandleArray[1], {
            where: {
              closeTime: moment(+currentCandleArray[0]).utc()
            }
          }).then(result => result[0]);

          /* Если обновлять нечего, значит записи про свечу нет и она является новой.
           Тогда запрашиваем полные данные по новой свечке и пишем в БД*/
          if (!result) {
            const newCandle = await this.getCandles(
              currentCandleArray[0],
              "ETHBTC",
              "1h",
              1
            )
              .then(candles => (candles.length ? candles[0] : null))
              .catch(err => {
                throw new Error(err);
              });

            // Ищем свечу в БД на всякий случай, если нет, то создаем
            await db.Candle.findOrCreate({
              where: newCandle
            });
          }
        }
      );
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  // Получить свечки от binance.com
  getCandles(startTime, symbol, period, limit = 1000) {
    return new Promise((resolve, reject) => {
      const fields = [
        "time",
        "open",
        "high",
        "low",
        "close",
        "volume",
        "closeTime",
        "assetVolume",
        "trades",
        "buyBaseVolume",
        "buyAssetVolume"
      ];
      BinanceAPI.candlesticks(
        symbol,
        period,
        (err, ticks, symbol) => {
          if (err) reject(err);
          resolve(
            // Нарезаем массив в удобный формат (массив объектов)
            ticks.map(tick => {
              let tickObj = {};
              tick.forEach((param, index) => {
                if (fields[index]) tickObj[fields[index]] = param;
              });

              tickObj.time = moment(tickObj.time).format("YYYY-MM-DD HH:mm:ss");
              tickObj.closeTime = moment(tickObj.time).format(
                "YYYY-MM-DD HH:mm:ss"
              );

              return { ...tickObj, symbol };
            })
          );
        },
        { limit, startTime }
      );
    });
  }
}

module.exports = new Binance();
