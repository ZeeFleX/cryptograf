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
      period: 48
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

    const MAD = Indicator.mad(valuesArray, {});
    MAD.forEach((MADItem, index) => {
      candlesData[index].MAD = MADItem.value;
    });

    // const MA = Indicator.ma(valuesArray, {
    //   period: 35
    // });

    // MA.forEach((MADItem, index) => {
    //   candlesData[index].MA = MADItem.value;
    // });

    // const MAShort = Indicator.ma(valuesArray, {
    //   period: 21
    // });

    // MAShort.forEach((MADItem, index) => {
    //   candlesData[index].MAShort = MADItem.value;
    // });

    MACD.bars.forEach((MACDBarItem, index) => {
      candlesData[index].MACDbar = MACDBarItem.value;
    });

    return candlesData;
  }

  checkForSignal(indicatorData, currentIndicatorValue, index) {
    if (!index) return false;
    const currentMACDBarPositive = currentIndicatorValue.MACDbar > 0;
    const prevMACDBarPositive = indicatorData[index - 1].MACDbar > 0;

    if (
      !prevMACDBarPositive &&
      currentMACDBarPositive &&
      currentIndicatorValue.MAD > 0
    ) {
      return {
        type: "buy"
      };
    } else if (
      prevMACDBarPositive &&
      !currentMACDBarPositive &&
      currentIndicatorValue.MAD < 0
    )
      return {
        type: "sell"
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

module.exports = {
  madirection: new MADirectionStrategy(),
  macd: new MACDStrategy(),
  random: new RandomStrategy()
};
