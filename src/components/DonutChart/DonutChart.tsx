"use client";

import styles from './DonutChart.module.css';
import Pie, { ProvidedProps, PieArcDatum } from '@visx/shape/lib/shapes/Pie';
import { scaleOrdinal } from '@visx/scale';
import { Group } from '@visx/group';
import { animated, useTransition, interpolate } from '@react-spring/web';
import { LegendItem, LegendLabel, LegendOrdinal } from '@visx/legend';

type ChartData = { label: string; value: number };
const getDataValue = (d: ChartData) => d.value;

const defaultMargin = { top: 20, right: 20, bottom: 20, left: 20 };

type PieChartProps = {
  data: ChartData[];
  getTooltipLabel?: () => any;
  width?: number;
  height?: number;
  margin?: typeof defaultMargin;
  sliceColors: string[];
  labels?:any
};

const PieChart = ({
  data,
  labels,
  height = 300,
  width = 300,
  margin = defaultMargin,
  sliceColors,
}: PieChartProps) => {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom - 30;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;
  const donutThickness = 50;

  const getDataColor = scaleOrdinal({
    domain: labels,
    range: sliceColors,
  });

  return (
    <div className={styles.container}>
      <svg width={width} height={height - 30}>
        {/*<GradientPinkBlue id='visx-pie-gradient' />*/}
        {/*<rect rx={14} width={width} height={height} fill="url('#visx-pie-gradient')" />*/}
        <Group top={centerY + margin.top} left={centerX + margin.left}>
          <Pie
            data={data}
            pieValue={getDataValue}
            outerRadius={radius}
            innerRadius={radius - donutThickness}
            cornerRadius={3}
            padAngle={0.005}
            // fill={(arc) => getDataColor(arc.data.label)}
          >
            {(pie) => (
              <AnimatedPie<ChartData>
                animate={true}
                {...pie}
                getKey={(arc) => arc.data.label}
                // onClickDatum={({ data: { label } }) =>
                //     animate &&
                //     setSelectedBrowser(selectedBrowser && selectedBrowser === label ? null : label)
                // }
                getColor={(arc) => getDataColor(arc.data.label)}
              />
            )}
          </Pie>
        </Group>
      </svg>
      <LegendOrdinal scale={getDataColor} labelFormat={(label) => `${label.toLowerCase()}`}>
        {(labels) => (
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {labels.map((label, i) => (
              <LegendItem
                key={`legend-quantile-${i}`}
                margin='0 10px'
                // onClick={() => {
                //   if (events) alert(`clicked: ${JSON.stringify(label)}`);
                // }}
              >
                <svg width={10} height={10}>
                  <circle fill={label.value} r={10 / 2} cx={10 / 2} cy={10 / 2} />
                  {/*<rect fill={label.value} width={10} height={10} />*/}
                </svg>
                <LegendLabel
                  align='left'
                  margin='0 0 0 4px'
                  // style={{ fontFamily: 'Inter' }}
                  className={styles.legendLabel}
                >
                  {label.text}
                </LegendLabel>
              </LegendItem>
            ))}
          </div>
        )}
      </LegendOrdinal>
    </div>
  );
};
export default PieChart;

// react-spring transition definitions
type AnimatedStyles = { startAngle: number; endAngle: number; opacity: number };

const fromLeaveTransition = ({ endAngle }: PieArcDatum<any>) => ({
  // enter from 360° if end angle is > 180°
  startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  opacity: 0,
});
const enterUpdateTransition = ({ startAngle, endAngle }: PieArcDatum<any>) => ({
  startAngle,
  endAngle,
  opacity: 1,
});

type AnimatedPieProps<Datum> = ProvidedProps<Datum> & {
  animate?: boolean;
  getKey: (d: PieArcDatum<Datum>) => string;
  getColor: (d: PieArcDatum<Datum>) => string;
  onClickDatum: (d: PieArcDatum<Datum>) => void;
  delay?: number;
};

function AnimatedPie<Datum>({ animate, arcs, path, getKey, getColor }: AnimatedPieProps<Datum>) {
  const transitions = useTransition<PieArcDatum<Datum>, AnimatedStyles>(arcs, {
    from: animate ? fromLeaveTransition : enterUpdateTransition,
    enter: enterUpdateTransition,
    update: enterUpdateTransition,
    leave: animate ? fromLeaveTransition : enterUpdateTransition,
    keys: getKey,
  });
  return transitions((props, arc, { key }) => {
    const [centroidX, centroidY] = path.centroid(arc);
    const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;

    return (
      <g key={key}>
        <animated.path
          // compute interpolated path d attribute from intermediate angle values
          d={interpolate([props.startAngle, props.endAngle], (startAngle, endAngle) =>
            path({
              ...arc,
              startAngle,
              endAngle,
            }),
          )}
          fill={getColor(arc)}
          // onClick={() => onClickDatum(arc)}
          // onTouchStart={() => onClickDatum(arc)}
        />
        {hasSpaceForLabel && (
          <animated.g style={{ opacity: props.opacity }}>
            <text
              fill='white'
              x={centroidX}
              y={centroidY}
              dy='.33em'
              fontSize={12}
              textAnchor='middle'
              pointerEvents='none'
            >
              {getKey(arc)}
            </text>
          </animated.g>
        )}
      </g>
    );
  });
}
