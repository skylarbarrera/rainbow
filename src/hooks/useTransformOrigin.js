import { get } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { transformOrigin as transformOriginUtil } from 'react-native-redash';

export default function useTransformOrigin(transformOrigin, onLayoutProp) {
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  const onLayout = useCallback(
    event => {
      if (transformOrigin && !height && !width) {
        setHeight(get(event, 'nativeEvent.layout.height'));
        setWidth(get(event, 'nativeEvent.layout.width'));
      }

      if (onLayoutProp) {
        onLayoutProp(event);
      }
    },
    [height, onLayoutProp, transformOrigin, width]
  );

  const { offsetX, offsetY } = useMemo(() => {
    const offsetMultiplier =
      transformOrigin === 'left' || transformOrigin === 'top' ? -1 : 1;

    let offsetX = 0;
    let offsetY = 0;

    if (transformOrigin === 'left' || transformOrigin === 'right') {
      offsetX = Math.floor(width / 2) * offsetMultiplier;
    } else if (transformOrigin === 'bottom' || transformOrigin === 'top') {
      offsetY = Math.floor(height / 2) * offsetMultiplier;
    }
    return { offsetX, offsetY };
  }, [height, transformOrigin, width]);

  const withTransformOrigin = useCallback(
    transform => transformOriginUtil({ x: offsetX, y: offsetY }, transform),
    [offsetX, offsetY]
  );

  return { onLayout, withTransformOrigin };
}
