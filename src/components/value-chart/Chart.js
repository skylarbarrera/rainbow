import React, { Fragment, useCallback, useMemo, useState, useRef } from 'react';
import ValueChart from './ValueChart';
import ValueText from './ValueText';
import {
  data1,
  data2,
  data3,
  data4,
  dataColored1,
  dataColored2,
  dataColored3,
} from './data';
import TimespanSelector from './TimespanSelector';
import { colors } from '../../styles';
import { Column } from '../layout';

const dataColored = [dataColored1, dataColored2, dataColored3];
const dataSwitching1 = [
  dataColored,
  [dataColored1, dataColored2],
  [dataColored2, dataColored3],
  [data4],
];

const dataSwitching2 = [
  [data2],
  [data1],
  [dataColored2, dataColored3],
  [data3],
];

const colorsArray = [
  colors.red,
  colors.grey,
  colors.green,
  colors.purple,
  colors.red,
  colors.green,
  colors.red,
  colors.purple,
  colors.green,
  colors.grey,
  colors.green,
  colors.purple,
];

const chartStroke = { detailed: 1.5, simplified: 3 };

let colorIndex = 0;

const Chart = props => {
  const textInputRef = useRef(null);

  // eslint-disable-next-line no-unused-vars
  const data1 = useMemo(() => {
    colorIndex = 0;
    return dataSwitching1.map((sectionsData, index) => {
      return {
        name: index,
        segments: sectionsData.map((data, i) => {
          return {
            color: colorsArray[colorIndex++],
            line: i * 5,
            points: data.map(values => {
              return {
                isImportant: Math.random() < 0.05 ? true : false,
                x: values.timestamp,
                y: values.value,
              };
            }),
            renderStartSeparator:
              colorIndex % 2 !== 0
                ? {
                    fill: colorsArray[colorIndex],
                    r: 7,
                    stroke: 'white',
                    strokeWidth: colorIndex + 2,
                  }
                : undefined,
          };
        }),
      };
    });
  }, []);

  const data2 = useMemo(() => {
    colorIndex = 0;
    return dataSwitching2.map((sectionsData, index) => {
      return {
        name: index,
        segments: sectionsData.map((data, i) => {
          return {
            color: colorsArray[colorIndex++],
            line: i * 5,
            points: data.map(values => {
              return { x: values.timestamp, y: values.value };
            }),
            renderStartSeparator:
              colorIndex % 2 !== 0
                ? {
                    fill: colorsArray[colorIndex],
                    r: 7,
                    stroke: 'white',
                    strokeWidth: colorIndex + 2,
                  }
                : undefined,
          };
        }),
      };
    });
  }, []);

  const [currentChart, setCurrentChart] = useState(0);
  const change = currentChart % 2 === 0 ? 20 : -20; // placeholder

  const valueRef = useRef(null);

  const [curVal, setCurVal] = useState(0);

  const handleValueUpdate = useCallback(v => {
    // console.log('value update', v);
    setCurVal(v);
    // textInputRef.current = v;
  }, [setCurVal]);

// lol => {
//           lol = valueRef.current;
//           console.log('lol', lol);
//           return lol;
//         }

  console.log('HAPPENIGN');

  return (
    <Column
      align="center"
      overflow="hidden"
      paddingBottom={21}
      paddingTop={19}
      width="100%"
      {...props}
    >
      <ValueText
        change={change.toFixed(2)}
        direction={change > 0}
        headerText="PRICE"
        value={curVal}
      />
      <ValueChart
        amountOfPathPoints={100}
        barColor={change > 0 ? colors.chartGreen : colors.red}
        currentDataSource={currentChart}
        data={data2}
        enableSelect
        importantPointsIndexInterval={25}
        mode="gesture-managed"
        onValueUpdate={handleValueUpdate}
        stroke={chartStroke}
      />
      <TimespanSelector
        color={change > 0 ? colors.chartGreen : colors.red}
        isLoading={false}
        reloadChart={setCurrentChart}
      />
    </Column>
  );
};

export default React.memo(Chart);
