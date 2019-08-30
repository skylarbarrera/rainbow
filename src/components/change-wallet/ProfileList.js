import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import { RecyclerListView, LayoutProvider, DataProvider } from 'recyclerlistview';
import { withNavigation } from 'react-navigation';
import { compose } from 'recompact';
import { deviceUtils } from '../../utils';
import { removeFirstEmojiFromString } from '../../helpers/emojiHandler';
import ProfileRow from './ProfileRow';
import ProfileOption from './ProfileOption';

const rowHeight = 50;

let position = 0;

const WALLET_ROW = 1;

class ProfileList extends React.Component {
  changeCurrentlyUsedContact = (address) => {
    this.currentlyOpenProfile = address;
  }

  closeAllDifferentContacts = (address) => {
    this.touchedContact = address;
    this.recentlyRendered = false;
    this.setState({ touchedContact: address });
  }

  balancesRenderItem = profile => (
    profile.isOption
      ? <ProfileOption icon={profile.icon} label={profile.label} onPress={profile.onPress}/>
      : <ProfileRow
        key={profile.address}
        accountName={profile.name}
        accountColor={profile.color}
        accountAddress={profile.address}
        onPress={() => this.props.onChangeWallet(profile)}
        onEditWallet={() => this.props.navigation.navigate('ExpandedAssetScreen', {
          address: profile.address,
          asset: [],
          isCurrentProfile: false,
          onCloseModal: () => this.props.onCloseEditProfileModal(),
          profile,
          type: 'profile_creator',
        })}


        onTouch={this.closeAllDifferentContacts}
        onTransitionEnd={this.changeCurrentlyUsedContact}
        currentlyOpenProfile={this.touchedContact}
      />
  );

  constructor(args) {
    super(args);

    this.state = {
      profiles: [],
    };

    this._layoutProvider = new LayoutProvider((i) => {
      return WALLET_ROW;
    }, (type, dim) => {
      if (type === WALLET_ROW) {
        dim.width = deviceUtils.dimensions.width;
        dim.height = rowHeight;
      } else {
        dim.width = 0;
        dim.height = 0;
      }
    });
    this._renderRow = this._renderRow.bind(this);
    this.currentlyOpenProfile = undefined;
    this.touchedContact = undefined;
    this.recentlyRendered = false;
  }

  _renderRow(type, data) {
    return this.balancesRenderItem(data);
  }

  componentWillReceiveProps = (props) => {
    const newAssets = Object.assign([], props.allAssets);
    for (let i = 0; i < newAssets.length; i++) {
      if (this.props.accountAddress === newAssets[i].address.toLowerCase()) {
        newAssets.splice(i, 1);
        break;
      }
    }
    newAssets.push({
      icon: 'plus',
      isOption: true,
      label: 'Create a Wallet',
      onPress: this.props.onPressCreateWallet,
    });
    newAssets.push({
      icon: 'gear',
      isOption: true,
      label: 'Import a Wallet',
      onPress: this.props.onPressImportSeedPhrase,
    });

    if (newAssets !== this.state.profiles) {
      this.setState({ profiles: newAssets });
    }
  }

  filterContactList = (list, searchPhrase, searchParameter = false, separator = ' ') => {
    const filteredList = [];
    if (list && searchPhrase.length > 0) {
      for (let i = 0; i < list.length; i++) {
        const searchedItem = searchParameter ? list[i][searchParameter] : list[i];
        const splitedWordList = searchedItem.split(separator);
        splitedWordList.push(searchedItem);
        splitedWordList.push(removeFirstEmojiFromString(searchedItem).join(''));
        for (let j = 0; j < splitedWordList.length; j++) {
          if (splitedWordList[j].toLowerCase().startsWith(searchPhrase.toLowerCase())) {
            filteredList.push(list[i]);
            break;
          }
        }
      }
    } else {
      return list;
    }
    return filteredList;
  }

  shouldComponentUpdate = () => {
    if (position < 0) {
      return false;
    }
    return true;
  }

  render() {
    return (
      <View style={{ height: this.props.height }}>
        <RecyclerListView
          rowRenderer={this._renderRow}
          dataProvider={
            new DataProvider((r1, r2) => {

              if (r1 !== r2) {
                return true;
              }
              return false;
            }).cloneWithRows(this.state.profiles)
          }
          layoutProvider={this._layoutProvider}
          onScroll={(event, _offsetX, offsetY) => {
            position = offsetY;
          }}
          optimizeForInsertDeleteAnimations
        />
      </View>
    );
  }
}

ProfileList.propTypes = {
  accountAddress: PropTypes.string,
  allAssets: PropTypes.array,
  navigation: PropTypes.object,
  onChangeWallet: PropTypes.func,
  onCloseEditProfileModal: PropTypes.func,
  onPressCreateWallet: PropTypes.func,
  onPressImportSeedPhrase: PropTypes.func,
};

export default compose(withNavigation)(ProfileList);
