import React, {createElement, useCallback} from 'react';
import {TouchableOpacity} from 'react-native';

export default function JellySelectorItem({
  index,
  isSelected,
  item,
  onLayout,
  onPress,
  renderItem,
  style,
  width,
  ...props
}) {
  const handleLayout = useCallback(e => onLayout(e, index), [index, onLayout]);
  const handlePress = useCallback(e => onPress(e, index), [index, onPress]);

  return (
    <TouchableOpacity
      onLayout={handleLayout}
      onPress={handlePress}
      style={[{width}, style]}>
      {createElement(renderItem, {
        isSelected,
        item,
        ...props,
      })}
    </TouchableOpacity>
  );
}
