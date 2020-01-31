const express = require("express");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const cors = require("cors");
const validator = require("express-validator");
const compression = require("compression");
const config = require("./config");
const createMiddleware = require("swagger-express-middleware");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const {
  Handlers: { errors }
} = require("./middlewares");
const {
  AccountsRouter,
  IndicatorsRouter,
  CandlesRouter
} = require("./routers");
const CandlesRepo = require("./repositories/candles.repo");
const Binance = require("./services/binance.service");

const app = express();
if (process.env.NODE_ENV === "development") app.use(cors());
let swaggerFile = path.join(__dirname, "docs/openapi.yml");

CandlesRepo.sync();
// setTimeout(() => {
//   Binance.candlesSubscribe("ETHBTC");
// }, 1000);

createMiddleware(swaggerFile, app, (err, middleware) => {
  if (err) throw new Error(err);
  app.use(
    middleware.metadata(),
    middleware.CORS(),
    middleware.files(),
    middleware.parseRequest(),
    middleware.validateRequest(),
    middleware.mock()
  );
});
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(null, config.application.swaggerUi)
);
app.set("trust proxy", true);
app.use(express.json({ extended: true }));
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(validator());
app.use(compression());
app.use(express.static(`public`));

app.use("/accounts", AccountsRouter);
app.use("/indicators", IndicatorsRouter);
app.use("/candles", CandlesRouter);
app.use(errors());

process.on("unhandledRejection", err => console.error("%O", err));
process.on("rejectionHandled", err => console.error("%O", err));
process.on("uncaughtException", err => console.error("%O", err));
process.on("warning", warning => console.warning(warning));

app.listen("3001", "0.0.0.0", () => {
  console.info(`Started on 0.0.0.0:3001`);
});
