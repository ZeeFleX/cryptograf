import React, { Component } from "react";
import { Route } from "react-router";
import { Link } from "react-router-dom";
import { observer, inject } from "mobx-react";
import { PrivateRoute } from "services/auth.service";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  FormGroup,
  FormInput,
  FormSelect
} from "shards-react";
import { Table, CardHeader } from "reactstrap";
import {
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
  Baseline,
  Resizable,
  Legend,
  BarChart
} from "react-timeseries-charts";
import moment from "moment";

//Components

//Styles
import "./tests.sass";

@inject("routing", "User", "TestsStore")
@observer
class TestsPage extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      showNewTestModal: false,
      formData: {
        strategy: "HACandles",
        symbol: "BNBUSDT",
        startTime: "2018-01-01",
        endTime: "2020-01-01",
        initialBaseBalance: 500,
        initialPriceBalance: 500,
        stopLoss: 2,
        trailingStop: 50,
        takeProfit: 80,
        riskAmount: 100
      }
    };
    this.state = { ...this.initialState };
  }
  componentWillMount() {
    this.props.TestsStore.getTests();
  }

  renderParams(params) {
    return Object.entries(params).map(paramArray => {
      if (paramArray[0] === "symbols") {
        return (
          <span>
            <span className="bold">Пары:</span> {paramArray[1].join(", ")}
          </span>
        );
      } else {
        return (
          <span style={{ marginRight: 5 }}>
            <span className="bold">{paramArray[0]}:</span> {paramArray[1]};
          </span>
        );
      }
    });
  }

  toggleNewTestModal() {
    this.setState({
      showNewTestModal: !this.state.showNewTestModal
    });
  }

  changeHandler(e) {
    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        [e.target.name]: e.target.value
      }
    });
  }

  repeatTest(test) {
    const testParams = {
      strategy: test.params.strategy,
      symbol: test.symbol,
      startTime: moment(test.startTime).format("YYYY-MM-DD"),
      endTime: moment(test.endTime).format("YYYY-MM-DD"),
      initialBaseBalance: test.initialBaseBalance,
      initialPriceBalance: test.initialPriceBalance,
      stopLoss: test.params.stopLoss,
      trailingStop: test.params.trailingStop,
      takeProfit: test.params.takeProfit,
      riskAmount: test.params.riskAmount
    };
    this.setState(
      {
        formData: testParams
      },
      () => {
        this.toggleNewTestModal();
      }
    );
  }

  submitHandler(e) {
    e.preventDefault();
    const testData = this.state.formData;
    this.props.TestsStore.createTest(testData);
    this.setState(this.initialState);
  }

  renderNewTestModal() {
    if (this.state.showNewTestModal)
      return (
        <Modal
          open={this.state.showNewTestModal}
          toggle={this.toggleNewTestModal.bind(this)}
        >
          <ModalHeader>Новый тест</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <label htmlFor="#strategy">Стратегия</label>
                <FormSelect
                  value={this.state.formData.strategy}
                  onChange={e => this.changeHandler(e)}
                  name="strategy"
                >
                  <option value="macd">MACD</option>
                  <option value="madirection">Moving Average Direction</option>
                  <option value="random">Random</option>
                  <option value="channel">Channel</option>
                  <option value="candles">Candles</option>
                  <option value="HACandles">Heikin Ashi</option>
                </FormSelect>
              </FormGroup>
              <FormGroup>
                <label htmlFor="#symbol">Пара</label>
                <FormSelect
                  value={this.state.formData.symbol}
                  onChange={e => this.changeHandler(e)}
                  name="symbol"
                >
                  <option value="BTCUSDT">BTC/USDT</option>
                  <option value="ETHUSDT">ETH/USDT</option>
                  <option value="BNBUSDT">BNB/USDT</option>
                  <option value="ETHBTC">ETH/BTC</option>
                  <option value="BNBBTC">BNB/BTC</option>
                  <option value="BNBETH">BNB/ETH</option>
                  <option value="ETCBNB">ETC/BNB</option>
                  <option value="IOTABNB">IOTA/BNB</option>
                  <option value="LTCBNB">LTC/BNB</option>
                  <option value="AIONBNB">AION/BNB</option>
                </FormSelect>
              </FormGroup>
              <FormGroup>
                <label htmlFor="#startTime">Начало</label>
                <FormInput
                  type="date"
                  placeholder="Начало"
                  value={this.state.formData.startTime}
                  onChange={e => this.changeHandler(e)}
                  name="startTime"
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="#endTime">Окончание</label>
                <FormInput
                  type="date"
                  placeholder="Окончание"
                  value={this.state.formData.endTime}
                  onChange={e => this.changeHandler(e)}
                  name="endTime"
                />
              </FormGroup>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <label htmlFor="#initialBaseBalance">
                      Начальный баланс base
                    </label>
                    <FormInput
                      type="text"
                      placeholder="base (левая в паре)"
                      value={this.state.formData.initialBaseBalance}
                      onChange={e => this.changeHandler(e)}
                      name="initialBaseBalance"
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <label htmlFor="#initialBaseBalance">
                      Начальный баланс price
                    </label>
                    <FormInput
                      type="text"
                      placeholder="price (правая в паре)"
                      value={this.state.formData.initialPriceBalance}
                      onChange={e => this.changeHandler(e)}
                      name="initialPriceBalance"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <label htmlFor="#stopLoss">Stop loss</label>
                <FormInput
                  type="text"
                  placeholder="Stop loss"
                  value={this.state.formData.stopLoss}
                  onChange={e => this.changeHandler(e)}
                  name="stopLoss"
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="#trailingStop">Trailing stop</label>
                <FormInput
                  type="text"
                  placeholder="Trailing stop"
                  value={this.state.formData.trailingStop}
                  onChange={e => this.changeHandler(e)}
                  name="trailingStop"
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="#takeProfit">Take profit</label>
                <FormInput
                  type="text"
                  placeholder="Take profit"
                  value={this.state.formData.takeProfit}
                  onChange={e => this.changeHandler(e)}
                  name="takeProfit"
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="#riskAmount">Risk amount</label>
                <FormInput
                  type="text"
                  placeholder="Risk amount"
                  value={this.state.formData.riskAmount}
                  onChange={e => this.changeHandler(e)}
                  name="riskAmount"
                />
              </FormGroup>
              <FormGroup>
                <Button
                  block
                  type="submit"
                  theme="success"
                  onClick={e => this.submitHandler(e)}
                >
                  Начать тест
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      );
  }

  render() {
    const { TestsStore } = this.props;
    return (
      <div className="wrapper">
        <Container className="content-container" id="content" fluid>
          <Row>
            <Col md={12}>
              {this.renderNewTestModal()}
              <Card>
                <CardHeader>Тестер стратегий</CardHeader>
                <CardBody>
                  <Button
                    onClick={() => this.setState({ showNewTestModal: true })}
                  >
                    Новый тест
                  </Button>
                  <hr />
                  <Table striped className="valign-middle">
                    <thead>
                      <tr>
                        <th>№</th>
                        <th>Пара</th>
                        <th>Начало</th>
                        <th>Конец</th>
                        <th>Начальный баланс</th>
                        <th>Конечный баланс</th>
                        <th>Прибыль</th>
                        <th>Сделки</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TestsStore &&
                        TestsStore.tests.map(test => (
                          <tr key={test.id}>
                            <td>{test.id}</td>
                            <td>{test.symbol}</td>
                            <td>
                              {moment(test.startTime).format("DD.MM.YYYY")}
                            </td>
                            <td>{moment(test.endTime).format("DD.MM.YYYY")}</td>
                            <td>
                              {(
                                test.initialBaseBalance +
                                test.initialPriceBalance
                              ).toFixed(2)}
                            </td>
                            <td>
                              {(
                                test.initialBaseBalance +
                                test.initialPriceBalance +
                                test.summaryProfit
                              ).toFixed(2)}
                            </td>
                            <td>
                              <span
                                className={
                                  test.summaryProfit > 0 ? "green" : "red"
                                }
                              >
                                {`${(
                                  (test.summaryProfit /
                                    (test.initialBaseBalance +
                                      test.initialPriceBalance)) *
                                  100
                                ).toFixed(2)} % (${test.summaryProfit})`}
                              </span>
                            </td>
                            <td>
                              <span className="green">
                                {
                                  test.Orders.filter(order => order.profit > 0)
                                    .length
                                }
                              </span>{" "}
                              /{" "}
                              <span className="red">
                                {
                                  test.Orders.filter(order => order.profit < 0)
                                    .length
                                }
                              </span>
                            </td>
                            <td>
                              <Row>
                                <Col md={4}>
                                  <Link
                                    className="btn btn-success"
                                    style={{ display: "block" }}
                                    to={`tests/${test.id}`}
                                  >
                                    Подробнее
                                  </Link>
                                </Col>
                                <Col md={4}>
                                  <Button
                                    block={true}
                                    theme="primary"
                                    onClick={this.repeatTest.bind(this, test)}
                                  >
                                    Повторить
                                  </Button>
                                </Col>
                                <Col md={4}>
                                  <Button
                                    block={true}
                                    theme="danger"
                                    onClick={() =>
                                      TestsStore.deleteTest(test.id)
                                    }
                                  >
                                    Удалить
                                  </Button>
                                </Col>
                              </Row>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default TestsPage;
