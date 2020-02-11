import React, { Component } from "react";
import { Route } from "react-router";
import { observer, inject } from "mobx-react";
import { PrivateRoute } from "services/auth.service";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  ListGroup,
  ListGroupItem
} from "shards-react";
import { Table, CardHeader } from "reactstrap";
import { TimeSeries, Index } from "pondjs";
import {
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
  Baseline,
  Resizable,
  Legend,
  BarChart,
  ScatterChart,
  styler
} from "react-timeseries-charts";
import moment from "moment";
import pluralize from "pluralize-ru";

//Components

//Styles
import "./details.sass";

@inject("routing", "User", "TestsStore", "TimeSeries", "IndicatorsStore")
@observer
class TestDetailsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      candles: null,
      balanceHistory: null,
      baseBalanceHistory: null,
      priceBalanceHistory: null,
      MAD: null,
      MA: null,
      styles: {
        macd: {
          base: styler([{ key: "value", color: "blue", width: 2 }]),
          bars: styler([{ key: "value", color: "green", width: 2 }]),
          signal: styler([
            { key: "value", color: "red", width: 2, strokeDasharray: "1,1" }
          ])
        },
        ma: styler([{ key: "value", color: "red", width: 2 }]),
        maShort: styler([{ key: "value", color: "green", width: 2 }]),
        mad: styler([{ key: "value", color: "orange", width: 2 }]),
        balance: {
          summary: styler([{ key: "value", color: "green", width: 2 }]),
          base: styler([{ key: "value", color: "blue", width: 1 }]),
          price: styler([{ key: "value", color: "red", width: 1 }])
        },
        buyOrders: styler([{ key: "value", color: "green" }]),
        sellOrders: styler([{ key: "value", color: "red" }])
      }
    };
  }
  async componentWillMount() {
    const { testId } = this.props.match.params;
    await this.props.TestsStore.getTest(testId);

    const test = this.props.TestsStore.test;
    await this.props.TimeSeries.getCandles(
      test.symbol,
      moment(test.startTime).format("YYYY-MM-DD"),
      moment(test.endTime).format("YYYY-MM-DD")
    );

    const valuesArray = this.props.TimeSeries.candles.map(candle => {
      return {
        time: candle.closeTime,
        value: candle.close
      };
    });
    await this.props.IndicatorsStore.getMAD(valuesArray, {});

    await this.props.IndicatorsStore.getMA(valuesArray, { period: 96 }, "long");
    await this.props.IndicatorsStore.getMA(
      valuesArray,
      { period: 48 },
      "short"
    );

    await this.props.IndicatorsStore.getMACD(valuesArray, {});

    const candlesPoints = this.props.TimeSeries.candles.map(candle => {
      return [moment(candle.closeTime).valueOf(), candle.close];
    });

    const balancePoints = test.TestStats.map(statItem => {
      return [moment(statItem.time).valueOf(), statItem.balance];
    });

    const baseBalancePoints = test.TestStats.map(statItem => {
      return [moment(statItem.time).valueOf(), statItem.baseBalance];
    });

    const priceBalancePoints = test.TestStats.map(statItem => {
      return [moment(statItem.time).valueOf(), statItem.priceBalance];
    });

    const MADPoints = this.props.IndicatorsStore.MAD.map(item => {
      return [moment(item.time).valueOf(), item.value];
    });

    const MAPoints = this.props.IndicatorsStore.MA.long.map(item => {
      return [moment(item.time).valueOf(), item.value];
    });

    const MAShortPoints = this.props.IndicatorsStore.MA.short.map(item => {
      return [moment(item.time).valueOf(), item.value];
    });

    const MACDPoints = {
      base: this.props.IndicatorsStore.MACD.base.map(item => {
        return [moment(item.time).valueOf(), item.value];
      }),
      signal: this.props.IndicatorsStore.MACD.signal.map(item => {
        return [moment(item.time).valueOf(), item.value];
      }),
      bars: this.props.IndicatorsStore.MACD.bars.map(item => {
        return [Index.getIndexString("1h", new Date(item.time)), item.value];
      })
    };

    const ordersBuyOpenPoints = test.Orders.filter(
      order => order.type === "buy"
    ).map(order => {
      return [moment(order.openTime).valueOf(), order.openPrice];
    });
    const ordersSellOpenPoints = test.Orders.filter(
      order => order.type === "sell"
    ).map(order => {
      return [moment(order.openTime).valueOf(), order.openPrice];
    });
    const ordersBuyClosePoints = test.Orders.filter(
      order => order.type === "buy"
    ).map(order => {
      return [moment(order.closeTime).valueOf(), order.closePrice];
    });
    const ordersSellClosePoints = test.Orders.filter(
      order => order.type === "sell"
    ).map(order => {
      return [moment(order.closeTime).valueOf(), order.closePrice];
    });

    const candlesSeries = new TimeSeries({
      name: "Candles",
      columns: ["time", "value"],
      points: candlesPoints
    });

    const balanceHistorySeries = new TimeSeries({
      name: "Balance",
      columns: ["time", "value"],
      points: balancePoints
    });

    const baseBalanceHistorySeries = new TimeSeries({
      name: "Base Balance",
      columns: ["time", "value"],
      points: baseBalancePoints
    });

    const priceBalanceHistorySeries = new TimeSeries({
      name: "Price Balance",
      columns: ["time", "value"],
      points: priceBalancePoints
    });

    const MADSeries = new TimeSeries({
      name: "MAD",
      columns: ["time", "value"],
      points: MADPoints
    });

    const MASeries = new TimeSeries({
      name: "MA",
      columns: ["time", "value"],
      points: MAPoints
    });

    const MAShortSeries = new TimeSeries({
      name: "MA Short",
      columns: ["time", "value"],
      points: MAShortPoints
    });

    const MACDSeries = {
      base: new TimeSeries({
        name: "MACD base",
        columns: ["time", "value"],
        points: MACDPoints.base
      }),
      signal: new TimeSeries({
        name: "MACD signal",
        columns: ["time", "value"],
        points: MACDPoints.signal
      }),
      bars: new TimeSeries({
        name: "MACD bars",
        columns: ["index", "value"],
        points: MACDPoints.bars
      })
    };

    const ordersBuyOpenSeries = new TimeSeries({
      name: "Orders buy",
      columns: ["time", "value"],
      points: ordersBuyOpenPoints
    });

    const ordersSellOpenSeries = new TimeSeries({
      name: "Orders sell",
      columns: ["time", "value"],
      points: ordersSellOpenPoints
    });

    const ordersBuyCloseSeries = new TimeSeries({
      name: "Orders buy",
      columns: ["time", "value"],
      points: ordersBuyClosePoints
    });

    const ordersSellCloseSeries = new TimeSeries({
      name: "Orders sell",
      columns: ["time", "value"],
      points: ordersSellClosePoints
    });

    this.setState({
      candles: candlesSeries,
      balanceHistory: balanceHistorySeries,
      baseBalanceHistory: baseBalanceHistorySeries,
      priceBalanceHistory: priceBalanceHistorySeries,
      MAD: MADSeries,
      MA: MASeries,
      MAShort: MAShortSeries,
      MACD: MACDSeries,
      orders: {
        buy: {
          open: ordersBuyOpenSeries,
          close: ordersBuyCloseSeries
        },
        sell: {
          open: ordersSellOpenSeries,
          close: ordersSellCloseSeries
        }
      },
      timeRange: candlesSeries.range()
    });
  }

  handleTimeRangeChange(timeRange) {
    this.setState({ timeRange });
  }

  renderTestParams(test) {
    const testParamsArray = Object.entries(test.params);
    return testParamsArray.map(paramArray => (
      <span key={paramArray[0]} className="mr-5">
        <span className="bold mr-1">{paramArray[0]}: </span>
        <span>{paramArray[1]}</span>
      </span>
    ));
  }

  render() {
    const { TestsStore } = this.props;
    const test = TestsStore.test;

    return (
      <div className="wrapper">
        <Container className="content-container" id="content" fluid>
          <Row>
            <Col md={12}>
              {+test.id === +this.props.match.params.testId && (
                <Card>
                  <CardHeader>Детали теста {test.id}</CardHeader>
                  <CardBody>
                    <h3>Параметры теста</h3>
                    {this.renderTestParams(test)}
                    <hr />
                    <h3>{test.symbol}</h3>
                    {this.state.candles && this.state.balanceHistory && (
                      <Resizable>
                        <ChartContainer
                          timeRange={this.state.timeRange}
                          timeAxisTickCount={10}
                          enablePanZoom={true}
                          maxTime={this.state.candles.range().end()}
                          minTime={this.state.candles.range().begin()}
                          onTimeRangeChanged={this.handleTimeRangeChange.bind(
                            this
                          )}
                          showGrid
                        >
                          <ChartRow height="400">
                            <YAxis
                              id={`main-${test.symbol}`}
                              label={test.symbol}
                              width="100"
                              type="linear"
                              format=".4f"
                              min={this.state.candles.min()}
                              max={this.state.candles.max()}
                              showGrid
                              labelOffset={-15}
                              style={{
                                ticks: {
                                  stroke: "#aaa",
                                  opacity: 0.25,
                                  "stroke-dasharray": "1,1"
                                }
                              }}
                            />
                            <Charts>
                              <LineChart
                                axis={`main-${test.symbol}`}
                                series={this.state.candles}
                              />
                              <LineChart
                                axis={`main-${test.symbol}`}
                                series={this.state.MA}
                                style={this.state.styles.ma}
                              />
                              <LineChart
                                axis={`main-${test.symbol}`}
                                series={this.state.MAShort}
                                style={this.state.styles.maShort}
                              />
                              <ScatterChart
                                axis={`main-${test.symbol}`}
                                series={this.state.orders.buy.open}
                                radius={(event, column) => 4}
                                style={this.state.styles.buyOrders}
                              />
                              <ScatterChart
                                axis={`main-${test.symbol}`}
                                series={this.state.orders.buy.close}
                                radius={(event, column) => 2}
                                style={this.state.styles.buyOrders}
                              />
                              <ScatterChart
                                axis={`main-${test.symbol}`}
                                series={this.state.orders.sell.open}
                                radius={(event, column) => 4}
                                style={this.state.styles.sellOrders}
                              />
                              <ScatterChart
                                axis={`main-${test.symbol}`}
                                series={this.state.orders.sell.close}
                                radius={(event, column) => 2}
                                style={this.state.styles.sellOrders}
                              />
                            </Charts>
                          </ChartRow>
                          <ChartRow height="150">
                            <YAxis
                              id={`macd-${test.symbol}`}
                              label={`MACD`}
                              width="100"
                              type="linear"
                              format=".4f"
                              min={this.state.MACD.base.min()}
                              max={this.state.MACD.base.max()}
                              showGrid
                              labelOffset={-15}
                              style={{
                                ticks: {
                                  stroke: "#aaa",
                                  opacity: 0.25,
                                  "stroke-dasharray": "1,1"
                                }
                              }}
                            />
                            <Charts>
                              <LineChart
                                axis={`macd-${test.symbol}`}
                                series={this.state.MACD.base}
                                style={this.state.styles.macd.base}
                              />
                              <LineChart
                                axis={`macd-${test.symbol}`}
                                series={this.state.MACD.signal}
                                style={this.state.styles.macd.signal}
                              />
                              <BarChart
                                axis={`macd-${test.symbol}`}
                                spacing={1}
                                series={this.state.MACD.bars}
                                minBarHeight={0}
                                style={this.state.styles.macd.bars}
                              />
                              <Baseline
                                axis={`macd-${test.symbol}`}
                                value={0.0}
                                position="right"
                              />
                            </Charts>
                          </ChartRow>
                          <ChartRow height="150">
                            <YAxis
                              id={`mad-${test.symbol}`}
                              label={`MA Direction`}
                              width="100"
                              type="linear"
                              format=".4f"
                              min={this.state.MAD.min()}
                              max={this.state.MAD.max()}
                              showGrid
                              labelOffset={-15}
                              style={{
                                ticks: {
                                  stroke: "#aaa",
                                  opacity: 0.25,
                                  "stroke-dasharray": "1,1"
                                }
                              }}
                            />
                            <Charts>
                              <LineChart
                                axis={`mad-${test.symbol}`}
                                series={this.state.MAD}
                                style={this.state.styles.mad}
                              />
                              <Baseline
                                axis={`mad-${test.symbol}`}
                                value={0.0}
                                position="right"
                              />
                            </Charts>
                          </ChartRow>
                          <ChartRow height="200">
                            <YAxis
                              id={`balance-${test.symbol}`}
                              label="Balance history"
                              width="100"
                              type="linear"
                              format=".2f"
                              min={Math.min(
                                this.state.baseBalanceHistory.min(),
                                this.state.priceBalanceHistory.min()
                              )}
                              max={this.state.balanceHistory.max()}
                              showGrid
                              labelOffset={-15}
                              style={{
                                ticks: {
                                  stroke: "#aaa",
                                  opacity: 0.25,
                                  "stroke-dasharray": "1,1"
                                }
                              }}
                            />
                            <Charts>
                              <LineChart
                                axis={`balance-${test.symbol}`}
                                series={this.state.balanceHistory}
                                style={this.state.styles.balance.summary}
                              />
                              <LineChart
                                axis={`balance-${test.symbol}`}
                                series={this.state.baseBalanceHistory}
                                style={this.state.styles.balance.base}
                              />
                              <LineChart
                                axis={`balance-${test.symbol}`}
                                series={this.state.priceBalanceHistory}
                                style={this.state.styles.balance.price}
                              />
                              <Baseline
                                axis={`balance-${test.symbol}`}
                                value={this.state.balanceHistory
                                  .select("value")
                                  .atFirst()
                                  .value()}
                                position="right"
                              />
                            </Charts>
                          </ChartRow>
                        </ChartContainer>
                      </Resizable>
                    )}
                    <h3>Сделки</h3>
                    <Table>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Пара</th>
                          <th>Объем</th>
                          <th>Тип</th>
                          <th>Цена открытия</th>
                          <th>Цена закрытия</th>
                          <th>Прибыль</th>
                          <th>Время открытия</th>
                          <th>Время закрытия</th>
                          <th>Продолжительность</th>
                          <th>Stop loss</th>
                          <th>Take profit</th>
                          <th>Статус</th>
                        </tr>
                      </thead>
                      <tbody>
                        {test.Orders.map(order => (
                          <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.symbol}</td>
                            <td>{Math.round(order.amount)}</td>
                            <td>
                              {order.type === "buy" ? "Покупка" : "Продажа"}
                            </td>
                            <td>{order.openPrice}</td>
                            <td>
                              <span
                                className={
                                  order.type === "buy" &&
                                  order.openPrice < order.closePrice
                                    ? "green"
                                    : "red"
                                }
                              >
                                {order.closePrice}
                              </span>
                            </td>
                            <td>
                              <span
                                className={order.profit > 0 ? "green" : "red"}
                              >
                                {order.profit &&
                                  `${(
                                    (order.profit / order.amount) *
                                    100
                                  ).toFixed(2)} % (${order.profit.toFixed(2)})`}
                              </span>
                            </td>
                            <td>
                              {moment(order.openTime).format(
                                "DD.MM.YYYY HH:mm"
                              )}
                            </td>
                            <td>
                              {order.closeTime &&
                                moment(order.closeTime).format(
                                  "DD.MM.YYYY HH:mm"
                                )}
                            </td>
                            <td>
                              {order.openTime && order.closeTime && (
                                <span>
                                  {pluralize(
                                    moment(order.closeTime).diff(
                                      moment(order.openTime),
                                      "days"
                                    ),
                                    "%d дней",
                                    "%d день",
                                    "%d дня",
                                    "%d дней"
                                  )}
                                </span>
                              )}
                            </td>
                            <td>{order.stopLoss}</td>
                            <td>{order.takeProfit}</td>
                            <td>
                              {order.status === "open" ? "Открыта" : "Закрыта"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default TestDetailsPage;
