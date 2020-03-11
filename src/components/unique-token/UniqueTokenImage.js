import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import FastImage from 'react-native-fast-image';
import { buildUniqueTokenName } from '../../helpers/assets';
import { colors, position } from '../../styles';
import { Centered } from '../layout';
import { Monospace } from '../text';
import ImageWithCachedDimensions from '../ImageWithCachedDimensions';

const FallbackTextColorVariants = {
  dark: colors.blueGreyLight,
  light: colors.white,
};

const getFallbackTextColor = bg =>
  colors.getTextColorForBackground(bg, FallbackTextColorVariants);

const UniqueTokenImage = ({ backgroundColor, imageUrl, item, resizeMode }) => {
  const [error, setError] = useState(null);
  const handleError = useCallback(error => setError(error), [setError]);

  return (
    <Centered
      shouldRasterizeIOS
      style={{ ...position.coverAsObject, backgroundColor }}
    >
      {imageUrl && !error ? (
        <ImageWithCachedDimensions
          id={imageUrl}
          onError={handleError}
          resizeMode={FastImage.resizeMode[resizeMode]}
          source={{ uri: imageUrl }}
          style={position.coverAsObject}
        />
      ) : (
        <Monospace
          align="center"
          color={getFallbackTextColor(backgroundColor)}
          lineHeight="looser"
          size="smedium"
        >
          {buildUniqueTokenName(item)}
        </Monospace>
      )}
    </Centered>
  );
};

UniqueTokenImage.propTypes = {
  backgroundColor: PropTypes.string,
  imageUrl: PropTypes.string,
  resizeMode: PropTypes.oneOf(Object.values(FastImage.resizeMode)),
};

UniqueTokenImage.defaultProps = {
  borderRadius: 0,
  resizeMode: 'cover',
};

export default React.memo(UniqueTokenImage);
