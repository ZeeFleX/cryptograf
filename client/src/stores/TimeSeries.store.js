import { observable, action, computed } from "mobx";
import { getCandles } from "../api/TimeSeries";
import { TimeSeries, Index } from "pondjs";
import moment from "moment";

class TimeSeriesStore {
  // Properties
  @observable candlesArray = [];
  @observable series = {};
  @observable MADComplexSeries = {};

  // Getters

  // Actions
  @action async getCandles() {
    const symbolCandles = await getCandles();
    for (var prop in symbolCandles) {
      let candlesArray = symbolCandles[prop];

      let points = {
        candles: [],
        volume: [],
        ma: [],
        maDirection: []
      };

      candlesArray.forEach(candle => {
        points.candles.push([
          moment(candle.closeTime).unix() * 1000,
          candle.close
        ]);
        points.volume.push([
          Index.getIndexString("1h", new Date(candle.closeTime)),
          candle.volume
        ]);
        points.ma.push([moment(candle.closeTime).unix() * 1000, candle.MA]);
        points.maDirection.push([
          moment(candle.closeTime).unix() * 1000,
          candle.MADirection
        ]);
      });

      const candlesSeries = new TimeSeries({
        name: "Candles",
        columns: ["time", "value"],
        points: points.candles
      });

      const volumeSeries = new TimeSeries({
        name: "Volume",
        columns: ["index", "value"],
        points: points.volume
      });

      const MAseries = new TimeSeries({
        name: "MA",
        columns: ["time", "value"],
        points: points.ma
      });

      const MADirectionseries = new TimeSeries({
        name: "MA Direction",
        columns: ["time", "value"],
        points: points.maDirection
      });

      this.series[prop] = {
        candles: {
          data: candlesSeries,
          timeRange: candlesSeries.range()
        },
        MA: {
          data: MAseries
        },
        volume: {
          data: volumeSeries
        },
        MADirection: {
          data: MADirectionseries
        }
      };
    }
  }
}

const store = new TimeSeriesStore();
export default store;
