import { ethers } from 'ethers';
import lang from 'i18n-js';
import { get, isEmpty, isNil } from 'lodash';
import { Alert } from 'react-native';
import {
  ACCESS_CONTROL,
  ACCESSIBLE,
  AUTHENTICATION_TYPE,
  canImplyAuthentication,
} from 'react-native-keychain';
import * as keychain from './keychain';
import {
  addHexPrefix,
  isHexString,
  isHexStringIgnorePrefix,
  isValidMnemonic,
  web3Provider,
} from '../handlers/web3';

const profiles = 'rainbowProfiles';
const walletName = 'rainbowWalletName';
const seedPhraseKey = 'rainbowSeedPhrase';
const privateKeyKey = 'rainbowPrivateKey';
const addressKey = 'rainbowAddressKey';

export function generateSeedPhrase() {
  return ethers.utils.HDNode.entropyToMnemonic(ethers.utils.randomBytes(16));
}

export const walletInit = async (seedPhrase = null) => {
  let walletAddress = null;
  let isImported = false;
  let isNew = false;
  if (!isEmpty(seedPhrase)) {
    walletAddress = await createWallet(seedPhrase);
    isImported = !isNil(walletAddress);
    return { isImported, isNew, walletAddress };
  }
  walletAddress = await loadAddress();
  if (!walletAddress) {
    walletAddress = await createWallet();
    isNew = true;
  }
  return { isImported, isNew, walletAddress };
};

export const loadWallet = async () => {
  const privateKey = await loadPrivateKey();
  if (privateKey) {
    return new ethers.Wallet(privateKey, web3Provider);
  }
  return null;
};

export const getChainId = async () => {
  const wallet = await loadWallet();
  return get(wallet, 'provider.chainId');
};

export const createTransaction = async (to, data, value, gasLimit, gasPrice, nonce = null) => ({
  data,
  gasLimit,
  gasPrice,
  nonce,
  to,
  value: ethers.utils.parseEther(value),
});

export const sendTransaction = async ({ transaction }) => {
  try {
    const wallet = await loadWallet();
    if (!wallet) return null;
    try {
      const result = await wallet.sendTransaction(transaction);
      return result.hash;
    } catch (error) {
      Alert.alert(lang.t('wallet.transaction.alert.failed_transaction'));
      return null;
    }
  } catch (error) {
    Alert.alert(lang.t('wallet.transaction.alert.authentication'));
    return null;
  }
};

export const signMessage = async (message, authenticationPrompt = lang.t('wallet.authenticate.please')) => {
  try {
    const wallet = await loadWallet(authenticationPrompt);
    try {
      const signingKey = new ethers.utils.SigningKey(wallet.privateKey);
      const sigParams = await signingKey.signDigest(ethers.utils.arrayify(message));
      return await ethers.utils.joinSignature(sigParams);
    } catch (error) {
      return null;
    }
  } catch (error) {
    Alert.alert(lang.t('wallet.transaction.alert.authentication'));
    return null;
  }
};

export const signPersonalMessage = async (message, authenticationPrompt = lang.t('wallet.authenticate.please')) => {
  try {
    const wallet = await loadWallet(authenticationPrompt);
    try {
      return await wallet.signMessage(isHexString(message) ? ethers.utils.arrayify(message) : message);
    } catch (error) {
      return null;
    }
  } catch (error) {
    Alert.alert(lang.t('wallet.transaction.alert.authentication'));
    return null;
  }
};

export const loadSeedPhrase = async (authenticationPrompt = lang.t('wallet.authenticate.please_seed_phrase')) => {
  const seedPhrase = await keychain.loadString(seedPhraseKey, { authenticationPrompt });
  return seedPhrase;
};

export const loadAddress = async () => {
  try {
    return await keychain.loadString(addressKey);
  } catch (error) {
    return null;
  }
};

const createWallet = async (seed) => {
  const walletSeed = seed || generateSeedPhrase();
  let wallet = null;
  try {
    if (isHexStringIgnorePrefix(walletSeed)
        && addHexPrefix(walletSeed).length === 66) {
      wallet = new ethers.Wallet(walletSeed);
    } else if (isValidMnemonic(walletSeed)) {
      wallet = ethers.Wallet.fromMnemonic(walletSeed);
    } else {
      let hdnode = ethers.utils.HDNode.fromSeed(walletSeed);
      let node = hdnode.derivePath("m/44'/60'/0'/0/0");
      wallet = new ethers.Wallet(node.privateKey);
    }
    if (wallet) {
      saveWalletDetails(walletSeed, wallet.privateKey, wallet.address);
      return wallet.address;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const saveWalletDetails = async (seedPhrase, privateKey, address) => {
  const canAuthenticate = await canImplyAuthentication({ authenticationType: AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS });
  let accessControlOptions = {};
  if (canAuthenticate) {
    accessControlOptions = { accessControl: ACCESS_CONTROL.USER_PRESENCE, accessible: ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY };
  }
  saveUserInfo('My Wallet', seedPhrase, privateKey, address, accessControlOptions);
  saveSeedPhrase(seedPhrase, accessControlOptions);
  savePrivateKey(privateKey, accessControlOptions);
  saveAddress(address);
  saveName('My Wallet');
};

const saveName = async (name, accessControlOptions = {}) => {
  await keychain.saveString(walletName, name, accessControlOptions);
};

export const loadName = async (authenticationPrompt = lang.t('wallet.authenticate.please')) => {
  try {
    const name = await keychain.loadString(walletName, { authenticationPrompt });
    return name;
  } catch (error) {
    return null;
  }
};

const saveSeedPhrase = async (seedPhrase, accessControlOptions = {}) => {
  await keychain.saveString(seedPhraseKey, seedPhrase, accessControlOptions);
};

const savePrivateKey = async (privateKey, accessControlOptions = {}) => {
  await keychain.saveString(privateKeyKey, privateKey, accessControlOptions);
};

const loadPrivateKey = async (authenticationPrompt = lang.t('wallet.authenticate.please')) => {
  try {
    const privateKey = await keychain.loadString(privateKeyKey, { authenticationPrompt });
    return privateKey;
  } catch (error) {
    return null;
  }
};

const saveAddress = async (address) => {
  await keychain.saveString(addressKey, address);
};

export const saveUserInfo = async (name, seedPhrase, privateKey, address, accessControlOptions = {}) => {
  const newProfile = {
    address,
    name,
    privateKey,
    seedPhrase,
  };
  let newProfilesTable = [];
  let userAlreadyInProfiles = false;
  const usersInfo = await loadUsersInfo();
  if (usersInfo) {
    newProfilesTable = usersInfo;
    for (let i = 0; i < newProfilesTable.length; i++) {
      if (usersInfo[i].address === address) {
        userAlreadyInProfiles = true;
      }
    }
  }
  if (!userAlreadyInProfiles) {
    newProfilesTable.push(newProfile);
    await keychain.saveString(profiles, JSON.stringify(newProfilesTable), accessControlOptions);
    return true;
  }
  return false;
};

export const deleteUserInfo = async (address, accessControlOptions = {}) => {
  let newProfilesTable = [];
  let searchedUserIndex;
  const usersInfo = await loadUsersInfo();
  if (usersInfo) {
    newProfilesTable = usersInfo;
    for (let i = 0; i < newProfilesTable.length; i++) {
      if (newProfilesTable[i].address === address) {
        searchedUserIndex = i;
      }
    }
  }
  if (searchedUserIndex) {
    newProfilesTable.splice(searchedUserIndex, 1);
    await keychain.saveString(profiles, JSON.stringify(newProfilesTable), accessControlOptions);
    return true;
  }
  return false;
};

export const editUserInfo = async (name, seedPhrase, privateKey, address, accessControlOptions = {}) => {
  const newProfile = {
    address,
    name,
    privateKey,
    seedPhrase,
  };
  let newProfilesTable = [];
  let searchedUserIndex;
  const usersInfo = await loadUsersInfo();
  if (usersInfo) {
    newProfilesTable = usersInfo;
    for (let i = 0; i < newProfilesTable.length; i++) {
      if (newProfilesTable[i].address === address) {
        searchedUserIndex = i;
      }
    }
  }
  if (searchedUserIndex) {
    newProfilesTable.splice(searchedUserIndex, 1, newProfile);
    await keychain.saveString(profiles, JSON.stringify(newProfilesTable), accessControlOptions);
    return true;
  }
  return false;
};

export const loadUsersInfo = async (authenticationPrompt = lang.t('wallet.authenticate.please')) => {
  try {
    const usersInfo = await keychain.loadString(profiles, { authenticationPrompt });
    return JSON.parse(usersInfo);
  } catch (error) {
    return [];
  }
};

export const loadCurrentUserInfo = async (authenticationPrompt = lang.t('wallet.authenticate.please')) => {
  try {
    const address = await keychain.loadString(addressKey, { authenticationPrompt });
    const seedPhrase = await keychain.loadString(seedPhraseKey, { authenticationPrompt });
    const privateKey = await keychain.loadString(privateKeyKey, { authenticationPrompt });
    let name = await keychain.loadString(walletName, { authenticationPrompt });
    if (!name) {
      name = 'My Wallet';
    }
    return {
      address,
      name,
      privateKey,
      seedPhrase,
    };
  } catch (error) {
    return null;
  }
};

export const saveCurrentUserInfo = async () => {
  const canAuthenticate = await canImplyAuthentication({ authenticationType: AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS });
  let accessControlOptions = {};
  if (canAuthenticate) {
    accessControlOptions = { accessControl: ACCESS_CONTROL.USER_PRESENCE, accessible: ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY };
  }
  const currentUser = await loadCurrentUserInfo();
  saveUserInfo(currentUser.name, currentUser.seedPhrase, currentUser.privateKey, currentUser.address, accessControlOptions);
};
