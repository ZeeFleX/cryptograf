import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { ChartCanvas, Chart, ZoomButtons } from "react-stockcharts";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
  CandlestickSeries,
  LineSeries,
  BarSeries
} from "react-stockcharts/lib/series";
import { last, timeIntervalBarWidth } from "react-stockcharts/lib/utils";
import { fitWidth } from "react-stockcharts/lib/helper";
import { scaleTime } from "d3-scale";
import { utcDay } from "d3-time";
import { tsvParse } from "d3-dsv";
import { timeParse, timeFormat } from "d3-time-format";
import {
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY
} from "react-stockcharts/lib/coordinates";
import { format } from "d3-format";
import { OHLCTooltip, SingleValueTooltip } from "react-stockcharts/lib/tooltip";
import {
  Label,
  LabelAnnotation,
  Annotate
} from "react-stockcharts/lib/annotation";
import moment from "moment";
import { FaAutoprefixer } from "react-icons/fa";

//Components

//Styles

@inject("routing", "User", "TimeSeries")
@observer
class CandlesChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }
  async componentWillMount() {
    const { TimeSeries, test } = this.props;

    await TimeSeries.getCandles({
      symbol: test.symbol,
      startTime: test.startTime,
      endTime: test.endTime
    });

    const xAccessor = d => d.date;
    const xExtents = [
      xAccessor(last(TimeSeries.candles)),
      xAccessor(TimeSeries.candles[0])
    ];

    const testStatData = test.TestStats.map(stat => {
      return {
        ...stat,
        date: moment(stat.time).toDate()
      };
    });

    let lastBalance = {};
    const data = TimeSeries.candles.map((candle, index) => {
      const testStat = testStatData.find(
        stat => stat.time === candle.closeTime
      );
      if (testStat)
        lastBalance = {
          base: testStat.baseBalance,
          price: testStat.priceBalance,
          summary: testStat.balance
        };
      const orderOpen = test.Orders.find(
        order => order.openTime === candle.closeTime
      );
      const orderClose = test.Orders.find(
        order => order.closeTime === candle.closeTime
      );

      return {
        ...candle,
        balance: testStat ? testStat.balance : lastBalance.summary,
        base: testStat ? testStat.baseBalance : lastBalance.base,
        price: testStat ? testStat.priceBalance : lastBalance.price,
        orderOpen: orderOpen || null,
        orderClose: orderClose || null
      };
    });

    this.setState({
      data,
      xAccessor,
      xExtents,
      testStatData,
      suffix: 1
    });
  }
  componentDidMount() {}
  handleReset() {
    this.setState({
      suffix: this.state.suffix + 1
    });
  }
  handleMouseOver(e) {
    document.querySelector("body").style.paddingRight =
      window.innerWidth - document.documentElement.clientWidth + "px";
    document.querySelector("body").style.overflow = "hidden";
  }
  handleMouseOut(e) {
    document.querySelector("body").style.overflow = "auto";
    document.querySelector("body").style.paddingRight = 0;
  }
  render() {
    const {
      gridProps,
      seriesType,
      width,
      mouseMoveEvent,
      panEvent,
      zoomEvent,
      zoomAnchor,
      clamp,
      type
    } = this.props;

    const height = 600;
    const margin = { left: 0, right: 100, top: 10, bottom: 30 };
    const gridWidth = width - margin.left - margin.right;

    const showGrid = true;
    const yGrid = showGrid
      ? {
          innerTickSize: -1 * gridWidth,
          tickStrokeDasharray: "ShortDash",
          tickStrokeOpacity: 0.2,
          tickStrokeWidth: 1
        }
      : {};
    const xGrid = showGrid
      ? {
          innerTickSize: -1 * gridWidth,
          tickStrokeDasharray: "ShortDash",
          tickStrokeOpacity: 0.2,
          tickStrokeWidth: 1
        }
      : {};

    const defaultAnnotationProps = {
      fontFamily: "Glyphicons Halflings",
      fontSize: 20,
      opacity: 0.8
    };

    const openAnnotationProps = {
      buy: {
        ...defaultAnnotationProps,
        fill: "green",
        text: "\u25b2",
        y: ({ yScale, datum }) => {
          return yScale(datum.low) + 25;
        },
        tooltip: "Покупка"
      },
      sell: {
        ...defaultAnnotationProps,
        fill: "green",
        text: "\u25bc",
        y: ({ yScale, datum }) => {
          return yScale(datum.high) - 10;
        },
        tooltip: "Продажа"
      }
    };

    const closeAnnotationProps = {
      buy: {
        ...defaultAnnotationProps,
        fill: "red",
        text: "\u25a0",
        y: ({ yScale, datum }) => {
          return yScale(datum.low) + 25;
        },
        tooltip: "Ордер закрыт"
      },
      sell: {
        ...defaultAnnotationProps,
        fill: "red",
        text: "\u25a0",
        y: ({ yScale, datum }) => {
          return yScale(datum.high) - 10;
        },
        tooltip: "Ордер закрыт"
      }
    };
    return (
      <div id="chart">
        {this.state.data && this.state.xAccessor && (
          <div
            onMouseOver={e => this.handleMouseOver(e)}
            onMouseOut={e => this.handleMouseOut(e)}
          >
            <ChartCanvas
              height={height}
              ratio={1}
              width={width}
              margin={margin}
              type={type}
              seriesName="MSFT"
              data={this.state.data}
              xAccessor={this.state.xAccessor}
              xScale={scaleTime()}
              xExtents={[
                this.state.xAccessor(last(this.state.data)),
                this.state.xAccessor(this.state.data[0])
              ]}
              mouseMoveEvent={mouseMoveEvent}
              panEvent={panEvent}
              zoomEvent={zoomEvent}
              clamp={clamp}
              zoomAnchor={zoomAnchor}
            >
              <Label
                x={(width - margin.left - margin.right) / 2}
                y={20}
                fontSize="24"
                text="BNBBTC"
              />
              <Chart id={1} yExtents={d => [d.high, d.low]} height={400}>
                <XAxis
                  axisAt="bottom"
                  orient="bottom"
                  zoomEnabled={zoomEvent}
                  {...gridProps}
                  {...xGrid}
                />
                <YAxis
                  axisAt="right"
                  orient="right"
                  ticks={5}
                  zoomEnabled={zoomEvent}
                  {...gridProps}
                  {...yGrid}
                />
                <CandlestickSeries
                  width={timeIntervalBarWidth(utcDay)}
                  widthRatio={0.7}
                />
                <MouseCoordinateY
                  at="right"
                  orient="right"
                  displayFormat={format(".2f")}
                />
                <OHLCTooltip origin={[0, 0]} />
                <ZoomButtons onReset={this.handleReset.bind(this)} />

                <Annotate
                  with={LabelAnnotation}
                  when={d => d.orderOpen && d.orderOpen.type === "buy"}
                  usingProps={openAnnotationProps.buy}
                />
                <Annotate
                  with={LabelAnnotation}
                  when={d => d.orderOpen && d.orderOpen.type === "sell"}
                  usingProps={openAnnotationProps.sell}
                />
                <Annotate
                  with={LabelAnnotation}
                  when={d => d.orderClose && d.orderClose.type === "buy"}
                  usingProps={closeAnnotationProps.buy}
                />
                <Annotate
                  with={LabelAnnotation}
                  when={d => d.orderClose && d.orderClose.type === "sell"}
                  usingProps={closeAnnotationProps.sell}
                />
              </Chart>
              <Chart
                id={2}
                yExtents={d => [0, d.balance]}
                height={125}
                origin={(w, h) => [0, 440]}
              >
                <XAxis
                  axisAt="bottom"
                  orient="bottom"
                  zoomEnabled={zoomEvent}
                  {...gridProps}
                  {...xGrid}
                />
                <YAxis
                  axisAt="right"
                  orient="right"
                  ticks={3}
                  tickFormat={format(".2s")}
                  {...gridProps}
                  {...xGrid}
                />
                <LineSeries
                  yAccessor={d => d.balance}
                  stroke="orange"
                  strokeWidth={2}
                />
                <SingleValueTooltip
                  yLabel="Summary balance"
                  yAccessor={d => d.balance}
                  origin={[0, 0]}
                />
                <LineSeries
                  yAccessor={d => d.base}
                  stroke="green"
                  strokeWidth={2}
                />
                <SingleValueTooltip
                  yLabel="Base balance"
                  yAccessor={d => d.base}
                  origin={[0, 15]}
                />
                <LineSeries
                  yAccessor={d => d.price}
                  stroke="red"
                  strokeWidth={2}
                />
                <SingleValueTooltip
                  yLabel="Price balance"
                  yAccessor={d => d.price}
                  origin={[0, 30]}
                />
                <MouseCoordinateX
                  at="bottom"
                  orient="bottom"
                  displayFormat={timeFormat("%Y-%m-%d")}
                />
                <MouseCoordinateY
                  at="right"
                  orient="right"
                  displayFormat={format(".2f")}
                />
              </Chart>
              <CrossHairCursor />
            </ChartCanvas>
          </div>
        )}
      </div>
    );
  }
}

CandlesChart.defaultProps = {
  type: "hybrid",
  mouseMoveEvent: true,
  panEvent: true,
  zoomEvent: true,
  clamp: true
};

CandlesChart = fitWidth(CandlesChart);

export default CandlesChart;
