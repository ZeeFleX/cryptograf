class Indicator {
  constructor() {}
  // Moving Average (скользящая средняя)
  ma(valuesArray, { period = 21 }) {
    function arraySum(array) {
      return array.reduce(function(sum, currentElement) {
        return currentElement ? sum + currentElement.value : sum;
      }, 0);
    }

    /* Ищем первый индекс не null для случаев, 
    когда входной массив вначале имеет некоторое количество null значений.
    Нужно для построения корректных производных. */
    const firstNotNullIndexElement = valuesArray.findIndex(
      item => item.value !== null
    );

    return valuesArray.map((element, index) => {
      // Составляем промежуточный массив из элементов = периоду
      let MAArray = [];
      for (let i = index - period; i < index; i++) {
        MAArray.push(valuesArray[i]);
      }

      // Считаем сумму элементов промежуточного массива и делим на количество. Получаем точку MA для текущей свечи
      let MAValue = arraySum(MAArray) / period;

      // Возвращаем значение MA для каждого элемента входящего массива
      return {
        index,
        time: element.time,
        value: index >= period + firstNotNullIndexElement ? MAValue : null
      };
    }); // Отрезаем пустые начальные элементы массива
  }

  // Moving Average Direction
  mad(valuesArray, { period = 52, shift = 1 }) {
    // Строим MA на основе входных данных
    const MAValuesArray = this.ma(valuesArray, { period });
    const MADValuesArray = MAValuesArray.map((element, index) => {
      // Считаем разницу текущего MA - MA 5 значений назад
      const difference =
        index >= shift + period
          ? ((element.value - MAValuesArray[index - shift].value) /
              MAValuesArray[index - shift].value) *
            100
          : null;
      return {
        index,
        time: element.time,
        value: difference
      };
    });
    return this.ma(MADValuesArray, { period: 9 });
  }

  macd(valuesArray, { shortPeriod = 24, longPeriod = 52, signalPeriod = 9 }) {
    // Считаем исходные данные. 2 MA с разными периодами
    const shortMAArray = this.ma(valuesArray, { period: shortPeriod });
    const longMAArray = this.ma(valuesArray, { period: longPeriod });

    // MACD линия (короткая средняя минус длинная средняя)
    const MACDArray = shortMAArray.map((shortMAItem, index) => {
      return {
        index,
        time: shortMAItem.time,
        value:
          index >= longPeriod
            ? shortMAItem.value - longMAArray[index].value
            : null
      };
    });

    // Сигнальная линия. Сглаженный MACD
    const MACDSignalArray = this.ma(MACDArray, { period: signalPeriod });

    // Гистограмма. Сигнальная линия минус MACD линия.
    const MACDBarsArray = MACDSignalArray.map((MACDSignalItem, index) => {
      return {
        index,
        time: MACDSignalItem.time,
        value:
          index >= signalPeriod + longPeriod
            ? MACDArray[index].value - MACDSignalItem.value
            : null
      };
    });

    return {
      base: MACDArray,
      signal: MACDSignalArray,
      bars: MACDBarsArray
    };
  }

  channel(candlesArray, { period = 21 }) {
    return candlesArray.map((candle, index) => {
      if (index < period)
        return {
          time: candle.closeTime,
          max: null,
          min: null
        };
      const channelArray = candlesArray.slice(index - period, index);

      const max = Math.max(...channelArray.map(item => item.high));
      const min = Math.min(...channelArray.map(item => item.low));
      const middle = (max + min) / 2;
      const range = ((max - min) / candle.close) * 100;
      return {
        time: candle.closeTime,
        max,
        min,
        middle,
        range
      };
    });
  }
}

module.exports = new Indicator();
