import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { sortList } from '../../helpers/sortList';
import { colors, margin, padding, position } from '../../styles';
import Tag from '../Tag';
import { Row } from '../layout';

const AttributesPadding = 15;

const AttributeItem = ({ trait_type: type, value }) =>
  type ? (
    <Tag css={margin(5)} key={`${type}${value}`} text={value} title={type} />
  ) : null;

AttributeItem.propTypes = {
  trait_type: PropTypes.string.isRequired,
  value: PropTypes.string,
};

const UniqueTokenAttributes = ({ traits }) => {
  const list = useMemo(() => sortList(traits, 'trait_type', 'asc'), [traits]);

  return (
    <Row
      align="start"
      style={{ transform: [{ translateX: -5 }, { translateY: -5 }] }}
      wrap
    >
      {list.map(AttributeItem)}
    </Row>
  );
};

UniqueTokenAttributes.propTypes = {
  traits: PropTypes.arrayOf(
    PropTypes.shape({
      trait_type: PropTypes.string.isRequired,
      value: PropTypes.node.isRequired,
    })
  ),
};

UniqueTokenAttributes.padding = AttributesPadding;

export default UniqueTokenAttributes;
