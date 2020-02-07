const Indicator = require("./indicator.service");

class FirstStrategy {
  getIndicators(candlesData) {
    const candlesWithMa = Indicator.MA(candlesData);
    const candlesWithMADirection = Indicator.MADirection(candlesWithMa);
    return candlesWithMADirection;
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

module.exports = {
  first: new FirstStrategy()
};
