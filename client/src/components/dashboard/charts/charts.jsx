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
  Nav,
  NavItem,
  NavLink
} from "shards-react";
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
import { styler } from "react-timeseries-charts";
import CrossHair from "./crosshair";

//Components

//Styles
import "./charts.sass";

const candlesStyle = styler([{ key: "value", color: "steelblue", width: 1 }]);
const MAStyle = styler([{ key: "value", color: "red", width: 2 }]);
const MACDBaseStyle = styler([{ key: "value", color: "blue", width: 2 }]);
const MACDSignalStyle = styler([{ key: "value", color: "red", width: 2 }]);
const MACDBarsStyle = styler([{ key: "value", color: "green", width: 2 }]);

@inject("routing", "User", "TimeSeries")
@observer
class ChartsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeRange: null,
      x: null,
      y: null,
      activeTab: 0
    };
  }
  componentWillMount() {
    this.props.TimeSeries.getCandles();
  }
  componentWillUpdate(props) {
    if (!this.state.timeRange) {
      this.setState({
        timeRange: props.TimeSeries.series.candles.timeRange
      });
    }
  }
  handleTimeRangeChange(timeRange) {
    this.setState({ timeRange });
  }
  handleMouseMove(x, y) {
    this.setState({ x, y });
  }
  handleTrackerChanged = tracker => {
    if (!tracker) {
      this.setState({ tracker, x: null, y: null });
    } else {
      this.setState({ tracker });
    }
  };

  renderCharts() {
    const series = this.props.TimeSeries.series;
    return (
      <Container fluid>
        <Nav pills>
          <NavItem>
            <NavLink
              key={"BTCUSDT"}
              id={"BTCUSDT"}
              active={true}
              style={{ cursor: "pointer" }}
              //onClick={e => this.setState({ activeTab: +e.target.id })}
            >
              BTCUSDT
            </NavLink>
          </NavItem>
        </Nav>
        <div>
          {series.candles && (
            <div>
              <Row className="mt-3">
                <Col md={12}>
                  <Resizable>
                    <ChartContainer
                      timeRange={this.state.timeRange}
                      timeAxisTickCount={10}
                      enablePanZoom={true}
                      maxTime={series.candles.data.range().end()}
                      minTime={series.candles.data.range().begin()}
                      onTimeRangeChanged={this.handleTimeRangeChange.bind(this)}
                      onMouseMove={(x, y) => this.handleMouseMove(x, y)}
                      showGrid
                    >
                      <ChartRow height="400">
                        <YAxis
                          id={`main-${"btcusdt"}`}
                          label={"btcusdt"}
                          width="100"
                          type="linear"
                          format=".4f"
                          min={series.candles.data.min()}
                          max={series.candles.data.max()}
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
                            axis={`main-${"btcusdt"}`}
                            series={series.candles.data}
                            style={candlesStyle}
                          />
                          <LineChart
                            axis={`main-${"btcusdt"}`}
                            series={series.ma.data}
                            style={MAStyle}
                          />
                          <CrossHair
                            x={this.state.x}
                            y={this.state.y}
                            axisX={true}
                            axisY={true}
                          />
                        </Charts>
                      </ChartRow>
                      <ChartRow height="150">
                        <YAxis
                          id={`${"btcusdt"}_MA_DIRECTION`}
                          label={`${"btcusdt"} MA Direction`}
                          width="100"
                          type="linear"
                          format=".2f"
                          min={
                            Math.max(
                              Math.abs(series.madirection.data.min()),
                              Math.abs(series.madirection.data.max())
                            ) * -1
                          }
                          max={Math.max(
                            Math.abs(series.madirection.data.min()),
                            Math.abs(series.madirection.data.max())
                          )}
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
                            axis={`${"btcusdt"}_MA_DIRECTION`}
                            series={series.madirection.data}
                            style={candlesStyle}
                          />
                          <Baseline
                            axis={`${"btcusdt"}_MA_DIRECTION`}
                            value={0.0}
                            position="right"
                          />
                          <CrossHair
                            x={this.state.x}
                            y={this.state.y}
                            axisX={true}
                            axisY={true}
                          />
                        </Charts>
                      </ChartRow>
                      <ChartRow height="150">
                        <YAxis
                          id={`${"btcusdt"}_MACD`}
                          label={`${"btcusdt"} MACD`}
                          width="100"
                          type="linear"
                          format=".2f"
                          min={series.macd.data.base.min()}
                          max={series.macd.data.base.max()}
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
                            axis={`${"btcusdt"}_MACD`}
                            series={series.macd.data.base}
                            style={MACDBaseStyle}
                          />
                          <LineChart
                            axis={`${"btcusdt"}_MACD`}
                            series={series.macd.data.signal}
                            style={MACDSignalStyle}
                          />
                          <Baseline
                            axis={`${"btcusdt"}_MACD`}
                            value={0.0}
                            position="right"
                          />
                          <BarChart
                            axis={`${"btcusdt"}_MACD`}
                            style={MACDBarsStyle}
                            spacing={1}
                            series={series.macd.data.bars}
                          />
                          <CrossHair
                            x={this.state.x}
                            y={this.state.y}
                            axisX={true}
                            axisY={true}
                          />
                        </Charts>
                      </ChartRow>
                    </ChartContainer>
                  </Resizable>
                </Col>
              </Row>
            </div>
          )}
        </div>
      </Container>
    );
  }
  render() {
    return (
      <Container className="content-container" id="content" fluid>
        <Row>
          <Col md={12}>
            <Card>
              <CardBody>
                <h3>Dashboard</h3>
                {this.renderCharts()}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ChartsPage;
