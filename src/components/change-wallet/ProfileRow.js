import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components/primitives';
import {
  View,
  Animated,
  StyleSheet,
  Text,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { abbreviations } from '../../utils';
import { TruncatedAddress } from '../text';
import { fonts, colors } from '../../styles';
import AvatarImageSource from '../../assets/avatar.png';
import { ButtonPressAnimation } from '../animations';
import { Icon } from '../icons';

const Container = styled.View`
  align-items: center;
  flex-direction: row;
  padding: 7.5px;
`;

const Nickname = styled.Text`
  font-family: ${fonts.family.SFProText};
  font-weight: ${fonts.weight.medium};
  font-size: ${fonts.size.smedium};
  color: ${colors.dark};
`;

const AddressAbbreviation = styled(TruncatedAddress).attrs({
  firstSectionLength: abbreviations.defaultNumCharsPerSection,
  size: 'smaller',
  truncationLength: 4,
  weight: 'medium',
})`
  font-family: ${fonts.family.SFProText};
  width: 100%;
  opacity: 0.5;
  text-transform: lowercase;
`;

const IconWrapper = styled.View`
  height: 30px
  width: 30px;
  border-radius: 14px;
  background-color: ${colors.skeleton};
  justify-content: center;
  align-items: center;
  margin-right: 19px;
`;

export default class ProfileRow extends Component {
  componentWillReceiveProps = () => {
    this.close();
  }

  onPress = () => {
  }

  onLongPress = () => {
    this._swipeableRow.openRight();
  }

  renderRightAction = (x, progress, onPress) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }], justifyContent: 'center' }}>
        <ButtonPressAnimation onPress={onPress} scaleTo={0.9}>
          <IconWrapper>
            <Icon
              color={colors.blueGreyMedium}
              height={15}
              width={15}
              name={'gear'}
            />
          </IconWrapper>
        </ButtonPressAnimation>
      </Animated.View>
    );
  };

  renderRightActions = progress => (
    <View style={{ width: 50, flexDirection: 'row' }}>
      {this.renderRightAction(50, progress, this.props.onPress)}
    </View>
  );

  updateRef = ref => {
    this._swipeableRow = ref;
  };

  close = () => {
    this._swipeableRow.close();
  };

  render() {
    const {
      accountAddress,
      accountName,
      isHeader,
      onPress,
    } = this.props;
    return (
      <Swipeable
        ref={this.updateRef}
        friction={2}
        rightThreshold={20}
        renderRightActions={this.renderRightActions}>
        <ButtonPressAnimation scaleTo={0.96} onPress={onPress} onLongPress={this.onLongPress}>
          <Container>
            <FastImage
              source={AvatarImageSource}
              style={{
                height: isHeader ? 37 : 33,
                marginLeft: 5,
                marginRight: isHeader ? 2 : 4,
                marginTop: isHeader ? 4 : 3.5,
                width: isHeader ? 37 : 35,
              }}
            />
            <View>
              <Nickname>
                {accountName}
              </Nickname>
              <AddressAbbreviation address={accountAddress} />
            </View>
          </Container>
        </ButtonPressAnimation>
      </Swipeable>
    );
  }
};

ProfileRow.propTypes = {
  accountAddress: PropTypes.string.isRequired,
  accountName: PropTypes.string.isRequired,
  isHeader: PropTypes.bool,
  onLongPress: PropTypes.func,
  onPress: PropTypes.func,
};

ProfileRow.defaultProps = {
  isHeader: false,
};

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: '#497AFC',
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});