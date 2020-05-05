import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import ShadowStack from 'react-native-shadow-stack';
import stylePropType from 'react-style-proptype';
import { useDimensions } from '../../../hooks';
import { colors, padding, position } from '../../../styles';
import { ButtonPressAnimation } from '../../animations';
import { Icon } from '../../icons';
import { InnerBorder, RowWithMargins } from '../../layout';
import { Emoji, Text } from '../../text';

const SheetActionButton = ({
  borderRadius,
  color,
  emoji,
  icon,
  label,
  onPress,
  style,
  ...props
}) => {
  const { width: deviceWidth } = useDimensions();

  const shadowsForButtonColor = useMemo(
    () => [
      [0, 10, 30, colors.dark, 0.2],
      [0, 5, 15, color, 0.4],
    ],
    [color]
  );

  return (
    <ButtonPressAnimation
      {...props}
      flex={1}
      onPress={onPress}
      scaleTo={0.96}
      style={[position.centeredAsObject, style]}
      zIndex={1}
    >
      <ShadowStack
        {...position.coverAsObject}
        backgroundColor={color}
        borderRadius={borderRadius}
        shadows={shadowsForButtonColor}
      />
      <RowWithMargins
        align="center"
        css={padding(9.5, 14, 11, 15)}
        height={deviceWidth >= 414 ? 48 : 46}
        margin={4}
        zIndex={1}
      >
        {emoji && <Emoji name={emoji} size="bmedium" />}
        {icon && <Icon color="white" name={icon} size={18} height={18} />}
        <Text color="white" size="large" weight="semibold">
          {label}
        </Text>
      </RowWithMargins>
      <InnerBorder radius={borderRadius} />
    </ButtonPressAnimation>
  );
};

SheetActionButton.propTypes = {
  borderRadius: PropTypes.number,
  color: PropTypes.string,
  emoji: PropTypes.string,
  onPress: PropTypes.func,
  style: stylePropType,
};

SheetActionButton.defaultProps = {
  borderRadius: 50,
  color: 'appleBlue',
};

export default SheetActionButton;
