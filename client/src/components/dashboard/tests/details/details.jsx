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
import CandlesChart from "../../charts/candles";

//Components

//Styles
import "./details.sass";

@inject("routing", "User", "TestsStore", "TimeSeries", "IndicatorsStore")
@observer
class TestDetailsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentWillMount() {
    const { testId } = this.props.match.params;
    await this.props.TestsStore.getTest(testId);

    const test = this.props.TestsStore.test;
    // await this.props.TimeSeries.getCandles(
    //   test.symbol,
    //   moment(test.startTime).format("YYYY-MM-DD"),
    //   moment(test.endTime).format("YYYY-MM-DD")
    // );

    // const valuesArray = this.props.TimeSeries.candles.map(candle => {
    //   return {
    //     time: candle.closeTime,
    //     value: candle.close
    //   };
    // });
    // await this.props.IndicatorsStore.getMAD(valuesArray, {});

    // await this.props.IndicatorsStore.getChannel(this.props.TimeSeries.candles, {
    //   period: 14
    // });

    // await this.props.IndicatorsStore.getMA(valuesArray, { period: 14 }, "long");
    // await this.props.IndicatorsStore.getMA(
    //   valuesArray,
    //   { period: 14 },
    //   "short"
    // );

    // await this.props.IndicatorsStore.getMACD(valuesArray, {});

    // const candlesPoints = this.props.TimeSeries.candles.map(candle => {
    //   return [moment(candle.closeTime).valueOf(), candle.close];
    // });

    // const balancePoints = test.TestStats.map(statItem => {
    //   return [moment(statItem.time).valueOf(), statItem.balance];
    // });

    // const baseBalancePoints = test.TestStats.map(statItem => {
    //   return [moment(statItem.time).valueOf(), statItem.baseBalance];
    // });

    // const priceBalancePoints = test.TestStats.map(statItem => {
    //   return [moment(statItem.time).valueOf(), statItem.priceBalance];
    // });

    // const MADPoints = this.props.IndicatorsStore.MAD.map(item => {
    //   return [moment(item.time).valueOf(), item.value];
    // });

    // const MAPoints = this.props.IndicatorsStore.MA.long.map(item => {
    //   return [moment(item.time).valueOf(), item.value];
    // });

    // const MAShortPoints = this.props.IndicatorsStore.MA.short.map(item => {
    //   return [moment(item.time).valueOf(), item.value];
    // });

    // const MACDPoints = {
    //   base: this.props.IndicatorsStore.MACD.base.map(item => {
    //     return [moment(item.time).valueOf(), item.value];
    //   }),
    //   signal: this.props.IndicatorsStore.MACD.signal.map(item => {
    //     return [moment(item.time).valueOf(), item.value];
    //   }),
    //   bars: this.props.IndicatorsStore.MACD.bars.map(item => {
    //     return [Index.getIndexString("1d", new Date(item.time)), item.value];
    //   })
    // };

    // const channelMaxPoints = this.props.IndicatorsStore.channel.map(item => {
    //   return [moment(item.time).valueOf(), item.max];
    // });

    // const channelMinPoints = this.props.IndicatorsStore.channel.map(item => {
    //   return [moment(item.time).valueOf(), item.min];
    // });

    // const channelMiddlePoints = this.props.IndicatorsStore.channel.map(item => {
    //   return [moment(item.time).valueOf(), item.middle];
    // });

    // const channelRangePoints = this.props.IndicatorsStore.channel.map(item => {
    //   return [moment(item.time).valueOf(), item.range];
    // });

    // const ordersBuyOpenPoints = test.Orders.filter(
    //   order => order.type === "buy"
    // )
    //   .sort((a, b) => (a.openTime > b.openTime ? 1 : -1))
    //   .map(order => {
    //     return [moment(order.openTime).valueOf(), order.openPrice];
    //   });
    // const ordersSellOpenPoints = test.Orders.filter(
    //   order => order.type === "sell"
    // )
    //   .sort((a, b) => (a.openTime > b.openTime ? 1 : -1))
    //   .map(order => {
    //     return [moment(order.openTime).valueOf(), order.openPrice];
    //   });
    // const ordersBuyClosePoints = test.Orders.filter(
    //   order => order.type === "buy"
    // )
    //   .sort((a, b) => (a.closeTime > b.closeTime ? 1 : -1))
    //   .map(order => {
    //     return [moment(order.closeTime).valueOf(), order.closePrice];
    //   });
    // const ordersSellClosePoints = test.Orders.filter(
    //   order => order.type === "sell"
    // )
    //   .sort((a, b) => (a.closeTime > b.closeTime ? 1 : -1))
    //   .map(order => {
    //     return [moment(order.closeTime).valueOf(), order.closePrice];
    //   });

    // const candlesSeries = new TimeSeries({
    //   name: "Candles",
    //   columns: ["time", "value"],
    //   points: candlesPoints
    // });

    // const balanceHistorySeries = new TimeSeries({
    //   name: "Balance",
    //   columns: ["time", "value"],
    //   points: balancePoints
    // });

    // const baseBalanceHistorySeries = new TimeSeries({
    //   name: "Base Balance",
    //   columns: ["time", "value"],
    //   points: baseBalancePoints
    // });

    // const priceBalanceHistorySeries = new TimeSeries({
    //   name: "Price Balance",
    //   columns: ["time", "value"],
    //   points: priceBalancePoints
    // });

    // const MADSeries = new TimeSeries({
    //   name: "MAD",
    //   columns: ["time", "value"],
    //   points: MADPoints
    // });

    // const MASeries = new TimeSeries({
    //   name: "MA",
    //   columns: ["time", "value"],
    //   points: MAPoints
    // });

    // const MAShortSeries = new TimeSeries({
    //   name: "MA Short",
    //   columns: ["time", "value"],
    //   points: MAShortPoints
    // });

    // const MACDSeries = {
    //   base: new TimeSeries({
    //     name: "MACD base",
    //     columns: ["time", "value"],
    //     points: MACDPoints.base
    //   }),
    //   signal: new TimeSeries({
    //     name: "MACD signal",
    //     columns: ["time", "value"],
    //     points: MACDPoints.signal
    //   }),
    //   bars: new TimeSeries({
    //     name: "MACD bars",
    //     columns: ["index", "value"],
    //     points: MACDPoints.bars
    //   })
    // };

    // const ordersBuyOpenSeries = new TimeSeries({
    //   name: "Orders buy",
    //   columns: ["time", "value"],
    //   points: ordersBuyOpenPoints
    // });

    // const ordersSellOpenSeries = new TimeSeries({
    //   name: "Orders sell",
    //   columns: ["time", "value"],
    //   points: ordersSellOpenPoints
    // });

    // const ordersBuyCloseSeries = new TimeSeries({
    //   name: "Orders buy",
    //   columns: ["time", "value"],
    //   points: ordersBuyClosePoints
    // });

    // const ordersSellCloseSeries = new TimeSeries({
    //   name: "Orders sell",
    //   columns: ["time", "value"],
    //   points: ordersSellClosePoints
    // });

    // const channelMaxSeries = new TimeSeries({
    //   name: "Channel max",
    //   columns: ["time", "value"],
    //   points: channelMaxPoints
    // });

    // const channelMinSeries = new TimeSeries({
    //   name: "Channel min",
    //   columns: ["time", "value"],
    //   points: channelMinPoints
    // });

    // const channelMiddleSeries = new TimeSeries({
    //   name: "Channel middle",
    //   columns: ["time", "value"],
    //   points: channelMiddlePoints
    // });

    // const channelRangeSeries = new TimeSeries({
    //   name: "Channel min",
    //   columns: ["time", "value"],
    //   points: channelRangePoints
    // });

    // this.setState({
    //   candles: candlesSeries,
    //   balanceHistory: balanceHistorySeries,
    //   baseBalanceHistory: baseBalanceHistorySeries,
    //   priceBalanceHistory: priceBalanceHistorySeries,
    //   MAD: MADSeries,
    //   MA: MASeries,
    //   MAShort: MAShortSeries,
    //   MACD: MACDSeries,
    //   orders: {
    //     buy: {
    //       open: ordersBuyOpenSeries,
    //       close: ordersBuyCloseSeries
    //     },
    //     sell: {
    //       open: ordersSellOpenSeries,
    //       close: ordersSellCloseSeries
    //     }
    //   },
    //   channel: {
    //     max: channelMaxSeries,
    //     min: channelMinSeries,
    //     middle: channelMiddleSeries,
    //     range: channelRangeSeries
    //   },
    //   timeRange: candlesSeries.range()
    // });
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
                    <CandlesChart test={test} />
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
