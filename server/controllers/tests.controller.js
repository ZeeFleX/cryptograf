const { TestsRepo } = require("../repositories");
const { Tester } = require("../services");

module.exports.get = {
  all: async (req, res, next) => {
    try {
      const tests = await TestsRepo.getTests();
      res.json(tests);
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  },
  one: async (req, res, next) => {
    try {
      const test = await TestsRepo.getTest(req.params);
      res.json(test);
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  }
};

module.exports.post = {
  startTest: async (req, res, next) => {
    try {
      const results = await Tester.start(req.body);
      res.json(results);
    } catch (error) {
      console.error(error);
    }
  }
};

module.exports.delete = {
  byId: async (req, res, next) => {
    try {
      const results = await TestsRepo.deleteTest(req.params);
      res.json(results);
    } catch (error) {
      console.error(error);
    }
  }
};
