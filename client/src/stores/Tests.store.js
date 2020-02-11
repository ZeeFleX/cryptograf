import { observable, action, computed } from "mobx";
import { getTests, createTest, deleteTest, getTest } from "../api/Tests";
import FlashStore from "./Flash.store";

class TestsStore {
  // Properties
  @observable allTests = [];
  @observable oneTest = {};

  // Getters
  @computed get tests() {
    return this.allTests.slice().sort((a, b) => (a.id > b.id ? 1 : -1));
  }
  @computed get test() {
    return this.oneTest;
  }
  // Actions
  @action async getTests() {
    this.allTests = await getTests();
  }

  @action async getTest(testId) {
    const getTestPromise = getTest(testId);
    getTestPromise.then(test => {
      this.oneTest = test;
    });

    return getTestPromise;
  }

  @action async deleteTest(testId) {
    const result = await deleteTest(testId);
    if (result)
      this.allTests = this.allTests.filter(test => test.id !== testId);
  }

  @action async createTest(testData) {
    createTest(testData);
    FlashStore.createFlash(
      "success",
      "Тест отправлен на выполнение. По окончанию получите уведомление"
    );
  }
}

const store = new TestsStore();
export default store;
