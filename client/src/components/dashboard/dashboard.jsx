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
import data from "../../mocks/test.json";
import moment from "moment";
import { styler } from "react-timeseries-charts";
import CrossHair from "./crosshair";

//Components

//Styles
import "./dashboard.sass";

const candlesStyle = styler([{ key: "value", color: "steelblue", width: 1 }]);
const styles = {
  BTCUSDT: styler([{ key: "value", color: "red", width: 2 }]),
  ETHUSDT: styler([{ key: "value", color: "green", width: 2 }]),
  BNBUSDT: styler([{ key: "value", color: "orange", width: 2 }])
};
const MAStyle = styler([{ key: "value", color: "red", width: 2 }]);

@inject("routing", "User", "TimeSeries")
@observer
class DashboardPage extends Component {
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
        timeRange: Object.entries(props.TimeSeries.series)[0][1].candles
          .timeRange
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
    let MADComplex = null;
    if (series["BTCUSDT"] && series["ETHUSDT"] && series["BNBUSDT"]) {
      MADComplex = {};
      MADComplex.BTCUSDT = series["BTCUSDT"].MADirection.data;
      MADComplex.ETHUSDT = series["ETHUSDT"].MADirection.data;
      MADComplex.BNBUSDT = series["BNBUSDT"].MADirection.data;
    }
    return (
      <Container fluid>
        <Nav pills>
          {Object.entries(series).map((series, index) => {
            const symbolName = series[0];
            return (
              <NavItem>
                <NavLink
                  key={index}
                  id={index}
                  active={index === this.state.activeTab}
                  style={{ cursor: "pointer" }}
                  onClick={e => this.setState({ activeTab: +e.target.id })}
                >
                  {symbolName}
                </NavLink>
              </NavItem>
            );
          })}
        </Nav>
        {Object.entries(series).map((item, index) => {
          const symbolName = item[0];
          const series = item[1];
          return (
            <div>
              {index === this.state.activeTab && MADComplex && (
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
                          onTimeRangeChanged={this.handleTimeRangeChange.bind(
                            this
                          )}
                          onMouseMove={(x, y) => this.handleMouseMove(x, y)}
                          showGrid
                        >
                          <ChartRow height="400">
                            <YAxis
                              id={`main-${symbolName}`}
                              label={symbolName}
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
                                axis={`main-${symbolName}`}
                                series={series.candles.data}
                                style={candlesStyle}
                              />
                              <LineChart
                                axis={`main-${symbolName}`}
                                series={series.MA.data}
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
                              id={`volume-${symbolName}`}
                              label={`${symbolName} volume`}
                              min={series.volume.data.min()}
                              max={series.volume.data.max()}
                              labelOffset={-15}
                              showGrid
                              format=".2s"
                              width="100"
                              type="linear"
                            />
                            <Charts>
                              <BarChart
                                axis={`volume-${symbolName}`}
                                spacing={1}
                                series={series.volume.data}
                                minBarHeight={0}
                              />
                              <CrossHair
                                x={this.state.x}
                                y={this.state.y}
                                axisX={true}
                                axisY={false}
                              />
                            </Charts>
                          </ChartRow>
                          <ChartRow height="250">
                            <YAxis
                              id={`COMPLEX_MA_DIRECTION`}
                              label={`Complex MA Direction`}
                              width="100"
                              type="linear"
                              format=".2f"
                              min={MADComplex.BNBUSDT.min()}
                              max={MADComplex.BNBUSDT.max()}
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
                                axis={`COMPLEX_MA_DIRECTION`}
                                series={MADComplex.BTCUSDT}
                                style={styles.BTCUSDT}
                              />
                              <LineChart
                                axis={`COMPLEX_MA_DIRECTION`}
                                series={MADComplex.ETHUSDT}
                                style={styles.ETHUSDT}
                              />

                              <LineChart
                                axis={`COMPLEX_MA_DIRECTION`}
                                series={MADComplex.BNBUSDT}
                                style={styles.BNBUSDT}
                              />
                              <Baseline
                                axis={`COMPLEX_MA_DIRECTION`}
                                value={0.0}
                                position="right"
                              />
                              <CrossHair
                                x={this.state.x}
                                y={this.state.y}
                                axisX={true}
                                axisY={false}
                              />
                            </Charts>
                          </ChartRow>
                          <ChartRow height="150">
                            <YAxis
                              id={`${symbolName}_MA_DIRECTION`}
                              label={`${symbolName} MA Direction`}
                              width="100"
                              type="linear"
                              format=".2f"
                              min={
                                Math.max(
                                  Math.abs(series.MADirection.data.min()),
                                  Math.abs(series.MADirection.data.max())
                                ) * -1
                              }
                              max={Math.max(
                                Math.abs(series.MADirection.data.min()),
                                Math.abs(series.MADirection.data.max())
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
                                axis={`${symbolName}_MA_DIRECTION`}
                                series={series.MADirection.data}
                                style={candlesStyle}
                              />
                              <Baseline
                                axis={`${symbolName}_MA_DIRECTION`}
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
                        </ChartContainer>
                      </Resizable>
                    </Col>
                  </Row>
                </div>
              )}
            </div>
          );
        })}
      </Container>
    );
  }
  render() {
    return (
      <div className="wrapper">
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
      </div>
    );
  }
}

export default DashboardPage;
