import { observable, action, computed } from "mobx";
import { getCandles } from "../api/TimeSeries";
import { TimeSeries, Index } from "pondjs";
import moment from "moment";

class TimeSeriesStore {
  // Properties
  @observable candles = [];

  // Getters

  // Actions
  @action async getCandles(
    symbol,
    startTime = moment().format("YYYY-MM-DD"),
    endTime = moment()
      .subtract("months", 3)
      .format("YYYY-MM-DD")
  ) {
    const getCandlesPromise = getCandles(symbol, startTime, endTime);
    getCandlesPromise.then(results => {
      const { candles } = results;
      this.candles = candles;
    });

    return getCandlesPromise;
  }
}

const store = new TimeSeriesStore();
export default store;
