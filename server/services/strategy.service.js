const Indicator = require("./indicator.service");

class MADirectionStrategy {
  getIndicators(candlesData, params) {
    let results = {};

    const valuesArray = candlesData.map((candle, index) => {
      return {
        index,
        time: candle.closeTime,
        value: candle.close
      };
    });
    const MADirection = Indicator.mad(valuesArray, {
      shift: 1,
      period: 5
    });

    MADirection.forEach((MADItem, index) => {
      candlesData[index].MADirection = MADItem.value;
    });

    return candlesData;
  }

  checkForSignal(indicatorData, currentIndicatorValue, index) {
    let signals = [];
    if (!index) return signals;
    const currentMADPositive = currentIndicatorValue.MADirection > 0;
    const prevMADPositive = indicatorData[index - 1].MADirection > 0;

    if (!prevMADPositive && currentMADPositive) signals.push("buy");
    if (prevMADPositive && !currentMADPositive) signals.push("sell");
    return signals;
  }
}

class MACDStrategy {
  getIndicators(candlesData, params) {
    const valuesArray = candlesData.map((candle, index) => {
      return {
        index,
        time: candle.closeTime,
        value: candle.close
      };
    });

    const MACD = Indicator.macd(valuesArray, {
      shortPeriod: 12,
      longPeriod: 26,
      signalPeriod: 9
    });

    const channelIndicator = Indicator.channel(candlesData, { period: 7 });

    const MAD = Indicator.mad(valuesArray, { period: 7 });
    MAD.forEach((MADItem, index) => {
      candlesData[index].MAD = MADItem.value;
    });

    MACD.bars.forEach((MACDBarItem, index) => {
      candlesData[index].MACDbar = MACDBarItem.value;
    });

    channelIndicator.forEach((ChannelItem, index) => {
      candlesData[index].channelMiddle = ChannelItem.middle;
      candlesData[index].channelRange = ChannelItem.range;
    });

    return candlesData;
  }

  checkForSignal(indicatorData, currentIndicatorValue, index) {
    let signals = [];
    if (!index || currentIndicatorValue.channelRange < 5) return signals;

    const currentMACDBarPositive = currentIndicatorValue.MACDbar > 0;
    const prevMACDBarPositive = indicatorData[index - 1].MACDbar > 0;

    if (
      !prevMACDBarPositive &&
      currentMACDBarPositive &&
      currentIndicatorValue.MAD > 0
    ) {
      signals.push("buy");
    } else if (
      prevMACDBarPositive &&
      !currentMACDBarPositive &&
      currentIndicatorValue.MAD < 0
    )
      signals.push("sell");
    return signals;
  }
}

class RandomStrategy {
  getIndicators(candlesData, params) {
    return candlesData;
  }

  checkForSignal(indicatorData, currentIndicatorValue, index) {
    let signals = [];
    if (Math.random() < 0.95) return signals;
    if (Math.random() >= 0.5) {
      signals.push("buy");
    } else {
      signals.push("sell");
    }
    return signals;
  }
}

class ChannelStrategy {
  getIndicators(candlesData, params) {
    const channelIndicator = Indicator.channel(candlesData, { period: 7 });

    return candlesData.map((candle, index) => {
      return {
        ...candle,
        channelMax: channelIndicator[index].max,
        channelMin: channelIndicator[index].min,
        channelMiddle: channelIndicator[index].middle,
        channelRange: channelIndicator[index].range
      };
    });
  }

  checkForSignal(indicatorData, currentIndicatorValue, index) {
    let signals = [];
    if (!index) return signals;
    if (currentIndicatorValue.channelRange < 10) return false;
    const currentChannelMiddlePositive =
      currentIndicatorValue.close > currentIndicatorValue.channelMiddle;
    const prevChannelMiddlePositive =
      indicatorData[index - 1].close > indicatorData[index - 1].channelMiddle;

    if (!prevChannelMiddlePositive && currentChannelMiddlePositive) {
      signals.push("buy");
    } else if (prevChannelMiddlePositive && !currentChannelMiddlePositive)
      signals.push("buy");

    return signals;
  }
}

class CandlesStrategy {
  getIndicators(candlesData, params) {
    return candlesData;
  }

  checkForSignal(indicatorData, currentIndicatorValue, index) {
    let signals = [];
    if (!index) return signals;

    const lastCandleIsPositive =
      currentIndicatorValue.close > currentIndicatorValue.open;

    if (lastCandleIsPositive) {
      signals.push("buy");
    } else if (!lastCandleIsPositive) signals.push("sell");
    return signals;
  }
}

class HACandlesStrategy {
  getIndicators(candlesData, params) {
    let HACandles = [];

    candlesData.forEach((candle, index) => {
      if (!index) {
        HACandles.push({ ...candle });
      } else {
        const prevCandle = HACandles[index - 1];
        const close =
          (candle.open + candle.high + candle.low + candle.close) / 4;
        const open = (prevCandle.open + prevCandle.close) / 2;
        const high = Math.max(candle.high, open, close);
        const low = Math.min(candle.low, open, close);

        HACandles.push({
          ...candle,
          close,
          high,
          open,
          low
        });
      }
    });
    const candles = candlesData.map((candle, index) => {
      const result = {
        ...candle,
        HA: {
          close: HACandles[index].close,
          high: HACandles[index].high,
          open: HACandles[index].open,
          low: HACandles[index].low
        }
      };

      return result;
    });
    const MAD = Indicator.mad(
      candlesData.map((candle, index) => {
        return {
          index,
          time: candle.closeTime,
          value: candle.close
        };
      }),
      { period: 21 }
    );
    MAD.forEach((MADItem, index) => {
      candles[index].MAD = MADItem.value;
    });
    return candles;
  }

  checkForSignal(indicatorData, currentIndicatorValue, index) {
    let signals = [];
    if (!currentIndicatorValue.HA || !index) return signals;

    const lastCandleIsPositive =
      currentIndicatorValue.HA.close > currentIndicatorValue.HA.open;
    const prevCandleIsPositive =
      indicatorData[index - 1].HA.close > indicatorData[index - 1].HA.open;

    if (
      !prevCandleIsPositive &&
      lastCandleIsPositive &&
      currentIndicatorValue.MAD > 0
    ) {
      signals.push("buy");
    }
    if (
      prevCandleIsPositive &&
      !lastCandleIsPositive &&
      currentIndicatorValue.MAD < 0
    ) {
      signals.push("sell");
    }
    if (prevCandleIsPositive && !lastCandleIsPositive) {
      signals.push("closeBuy");
    }
    if (!prevCandleIsPositive && lastCandleIsPositive) {
      signals.push("closeSell");
    }

    return signals;
  }
}

module.exports = {
  madirection: new MADirectionStrategy(),
  macd: new MACDStrategy(),
  random: new RandomStrategy(),
  channel: new ChannelStrategy(),
  candles: new CandlesStrategy(),
  HACandles: new HACandlesStrategy()
};
