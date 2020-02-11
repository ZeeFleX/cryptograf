import { observable, action, computed } from "mobx";
import { getMAD, getMA, getMACD } from "../api/Indicators";
import moment from "moment";

class IndicatorsStore {
  // Properties
  @observable MAD = [];
  @observable MA = {};
  @observable MACD = [];
  // Getters

  // Actions
  @action async getMAD(valuesArray, params) {
    const getMADPromise = getMAD(valuesArray, params);
    getMADPromise.then(MAD => {
      this.MAD = MAD;
    });

    return getMADPromise;
  }

  @action async getMA(valuesArray, params, MAName) {
    const getMAPromise = getMA(valuesArray, params);
    getMAPromise.then(MA => {
      this.MA[MAName] = MA;
    });

    return getMAPromise;
  }

  @action async getMACD(valuesArray, params) {
    const getMACDPromise = getMACD(valuesArray, params);
    getMACDPromise.then(MACD => {
      this.MACD = MACD;
    });

    return getMACDPromise;
  }
}

const store = new IndicatorsStore();
export default store;
