import React, { Component } from "react";
import { Route } from "react-router";
import { observer, inject } from "mobx-react";
import { PrivateRoute } from "services/auth.service";
import { Container, Row, Col, Card, CardBody } from "shards-react";
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

//Components

//Styles
import "./dashboard.sass";

const candlesStyle = styler([{ key: "value", color: "steelblue", width: 1 }]);
const MAStyle = styler([{ key: "value", color: "red", width: 2 }]);

@inject("routing", "User", "TimeSeries")
@observer
class DashboardPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeRange: null
    };
  }
  componentDidMount() {
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
  render() {
    const series = this.props.TimeSeries.series;
    return (
      <div className="wrapper">
        <Container className="content-container" id="content" fluid>
          <Row>
            <Col md={12}>
              <Card>
                <CardBody>
                  <h3>Dashboard</h3>
                  {!!series.candles.data && this.state.timeRange && (
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
                        showGrid
                      >
                        <ChartRow height="400">
                          <YAxis
                            id="ETHBTC"
                            label="ETHBTC"
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
                              axis="ETHBTC"
                              series={series.candles.data}
                              style={candlesStyle}
                            />
                            <LineChart
                              axis="ETHBTC"
                              series={series.MA.data}
                              style={MAStyle}
                            />
                          </Charts>
                        </ChartRow>
                        <ChartRow height="150">
                          <YAxis
                            id="volume"
                            label="ETHBTC Volume"
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
                              axis="volume"
                              spacing={1}
                              series={series.volume.data}
                              minBarHeight={0}
                            />
                          </Charts>
                        </ChartRow>
                      </ChartContainer>
                    </Resizable>
                  )}
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
