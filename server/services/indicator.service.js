const moment = require("moment");
const db = require("../models");

class Indicator {
  constructor() {}
  // Moving Average
  MA(timeSeries, period = 21) {
    function arraySum(array) {
      return array.reduce(function(sum, current) {
        return sum + current.close;
      }, 0);
    }

    return timeSeries
      .map((candle, index) => {
        // Пропускаем первые свечи, т.к. не хватает данных для покрытия периода
        if (index < period) return;

        // Составляем промежуточный массив из элементов = периоду
        let MAArray = [];
        for (let i = index - period; i < index; i++) {
          MAArray.push(timeSeries[i]);
        }
        // Считаем сумму элементов промежуточного массива и делим на количество. Получаем точку MA для текущей свечи
        let MAValue = arraySum(MAArray) / period;

        // Возвращаем свечку с добавленным значением MA
        return {
          ...candle,
          MA: MAValue
        };
      })
      .splice(period, timeSeries.length - period); // Отрезаем пустые начальные элементы массива
  }

  // Moving Average Direction
  MADirection(timeSeries, shift = 5) {
    return timeSeries
      .map((candle, index) => {
        if (index < shift) return;
        const difference = candle.MA - timeSeries[index - shift].MA;
        return {
          ...candle,
          MADirection: difference / (candle.MA / 100)
        };
      })
      .splice(shift, timeSeries.length - shift);
  }

  // Bands
  Bands(timeSeries, period = 3) {
    function arraySum(array, price) {
      return array.reduce(function(sum, current) {
        return sum + current[price];
      }, 0);
    }

    return timeSeries
      .map((candle, index) => {
        // Пропускаем первые свечи, т.к. не хватает данных для покрытия периода
        if (index < period) return;

        // Составляем промежуточный массив из элементов = периоду
        let MAArray = [];
        for (let i = index - period; i < index; i++) {
          MAArray.push(timeSeries[i]);
        }
        // Считаем сумму элементов промежуточного массива и делим на количество. Получаем точку MA для текущей свечи
        let MAhigh = arraySum(MAArray, "high") / period;
        let MAlow = arraySum(MAArray, "low") / period;
        let MAclose = arraySum(MAArray, "close") / period;

        // Возвращаем свечку с добавленным значением MA
        return {
          ...candle,
          bands: {
            width: MAhigh - MAlow,
            signal: ((MAclose - MAlow) / (MAhigh - MAlow)) * 100
          }
        };
      })
      .splice(period, timeSeries.length - period); // Отрезаем пустые начальные элементы массива
  }
}

module.exports = new Indicator();
