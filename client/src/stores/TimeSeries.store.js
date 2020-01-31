import { observable, action, computed } from "mobx";
import { getCandles } from "../api/TimeSeries";
import { TimeSeries, Index } from "pondjs";
import moment from "moment";

class TimeSeriesStore {
  // Properties
  @observable candlesArray = [];
  @observable series = {
    candles: {
      data: null,
      timeRange: null
    },
    MA: {
      data: null
    },
    volume: {
      data: null
    }
  };

  // Getters

  // Actions
  @action async getCandles() {
    const candles = await getCandles();
    this.candlesArray = candles;

    let points = {
      candles: [],
      volume: [],
      ma: []
    };

    this.candlesArray.forEach(candle => {
      points.candles.push([
        moment(candle.closeTime).unix() * 1000,
        candle.close
      ]);
      points.volume.push([
        Index.getIndexString("1h", new Date(candle.closeTime)),
        candle.volume
      ]);
      points.ma.push([moment(candle.closeTime).unix() * 1000, candle.MA]);
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

    this.series = {
      candles: {
        data: candlesSeries,
        timeRange: candlesSeries.range()
      },
      MA: {
        data: MAseries
      },
      volume: {
        data: volumeSeries
      }
    };
  }
}

const store = new TimeSeriesStore();
export default store;
