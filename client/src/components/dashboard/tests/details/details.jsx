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
                          <th>Комиссия</th>
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
                              {`${
                                order.baseFee && order.priceFee
                                  ? (order.baseFee + order.priceFee).toFixed(2)
                                  : "-"
                              }`}
                              <br />{" "}
                              {`(${
                                order.baseFee ? order.baseFee.toFixed(2) : "-"
                              } / ${
                                order.priceFee ? order.priceFee.toFixed(2) : "-"
                              })`}
                            </td>
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
