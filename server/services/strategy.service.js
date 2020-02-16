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
    if (!index) return false;
    const currentMADPositive = currentIndicatorValue.MADirection > 0;
    const prevMADPositive = indicatorData[index - 1].MADirection > 0;

    if (!prevMADPositive && currentMADPositive)
      return {
        type: "buy"
      };
    if (prevMADPositive && !currentMADPositive)
      return {
        type: "sell"
      };
    return false;
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
    if (!index) return false;
    if (currentIndicatorValue.channelRange < 5) return false;

    const currentMACDBarPositive = currentIndicatorValue.MACDbar > 0;
    const prevMACDBarPositive = indicatorData[index - 1].MACDbar > 0;

    if (
      !prevMACDBarPositive &&
      currentMACDBarPositive &&
      currentIndicatorValue.MAD > 0
    ) {
      return {
        type: "buy",
        stopLoss: currentIndicatorValue.low,
        takeProfit:
          (currentIndicatorValue.close - currentIndicatorValue.low) * 3 +
          currentIndicatorValue.close
      };
    } else if (
      prevMACDBarPositive &&
      !currentMACDBarPositive &&
      currentIndicatorValue.MAD < 0
    )
      return {
        type: "sell",
        stopLoss: currentIndicatorValue.high,
        takeProfit:
          currentIndicatorValue.close -
          (currentIndicatorValue.high - currentIndicatorValue.close) * 3
      };
    return false;
  }
}

class RandomStrategy {
  getIndicators(candlesData, params) {
    return candlesData;
  }

  checkForSignal(indicatorData, currentIndicatorValue, index) {
    if (Math.random() < 0.95) return false;
    if (Math.random() >= 0.5) {
      return {
        type: "buy"
      };
    } else {
      return {
        type: "sell"
      };
    }
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
    if (!index) return false;
    if (currentIndicatorValue.channelRange < 10) return false;
    const currentChannelMiddlePositive =
      currentIndicatorValue.close > currentIndicatorValue.channelMiddle;
    const prevChannelMiddlePositive =
      indicatorData[index - 1].close > indicatorData[index - 1].channelMiddle;

    // const stopLoss =
    //   (currentIndicatorValue.channelMax - currentIndicatorValue.channelMiddle) /
    //   1;
    const stopLoss =
      currentIndicatorValue.close - currentIndicatorValue.channelMiddle;
    if (!prevChannelMiddlePositive && currentChannelMiddlePositive) {
      return {
        type: "buy",
        stopLoss: currentIndicatorValue.channelMiddle + stopLoss,
        takeProfit: currentIndicatorValue.channelMiddle + stopLoss * 3
      };
    } else if (prevChannelMiddlePositive && !currentChannelMiddlePositive)
      return {
        type: "sell",
        stopLoss: currentIndicatorValue.channelMiddle + stopLoss,
        takeProfit: currentIndicatorValue.channelMiddle + stopLoss * 3
      };
    return false;
  }
}

class CandlesStrategy {
  getIndicators(candlesData, params) {
    return candlesData;
  }

  checkForSignal(indicatorData, currentIndicatorValue, index) {
    if (!index) return false;

    const lastCandleIsPositive =
      currentIndicatorValue.close > currentIndicatorValue.open;

    if (lastCandleIsPositive) {
      return {
        type: "buy",
        stopLoss: currentIndicatorValue.low,
        takeProfit: currentIndicatorValue.close * 1.1
      };
    } else if (!lastCandleIsPositive)
      return {
        type: "sell",
        stopLoss: currentIndicatorValue.high,
        takeProfit: currentIndicatorValue.close * 0.9
      };
    return false;
  }
}

module.exports = {
  madirection: new MADirectionStrategy(),
  macd: new MACDStrategy(),
  random: new RandomStrategy(),
  channel: new ChannelStrategy(),
  candles: new CandlesStrategy()
};
