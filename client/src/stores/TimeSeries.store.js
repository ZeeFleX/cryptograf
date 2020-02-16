import { observable, action, computed } from "mobx";
import { getCandles } from "../api/TimeSeries";
import { TimeSeries, Index } from "pondjs";
import moment from "moment";

class TimeSeriesStore {
  // Properties
  @observable candles = [];

  // Getters

  // Actions
  @action async getCandles({
    symbol = "BTCUSDT",
    endTime = moment().format("YYYY-MM-DD"),
    startTime = moment()
      .subtract(3, "months")
      .format("YYYY-MM-DD"),
    tsv = false
  }) {
    const getCandlesPromise = getCandles({ symbol, startTime, endTime, tsv });
    getCandlesPromise.then(results => {
      this.candles = results.map(candle => {
        return {
          ...candle,
          date: moment(candle.closeTime).toDate()
        };
      });
    });

    return getCandlesPromise;
  }
}

const store = new TimeSeriesStore();
export default store;
