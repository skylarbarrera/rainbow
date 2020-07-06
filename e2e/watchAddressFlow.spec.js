/* eslint-disable no-undef */
/* eslint-disable jest/expect-expect */
import * as Helpers from './helpers';

describe('Import from seed flow', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('Should show the welcome screen', async () => {
    await Helpers.checkIfVisible('welcome-screen');
  });

  it('Should show the "Restore Sheet" after tapping on "I already have a wallet"', async () => {
    await device.disableSynchronization();
    await Helpers.tap('already-have-wallet-button');
    await Helpers.delay(2000);
    await Helpers.checkIfExists('restore-sheet');
  });

  it('show the "Import Sheet" when tapping on "Watch an Ethereum address"', async () => {
    await Helpers.tap('watch-address-button');
    await Helpers.delay(2000);
    await Helpers.checkIfExists('import-sheet');
  });

  it('Should show the "Add wallet modal" after tapping import with a valid private key"', async () => {
    await Helpers.clearField('import-sheet-input');
    await Helpers.checkIfHasText('import-sheet-button-label', 'Paste');
    await Helpers.typeText('import-sheet-input', 'vitalik.eth');
    await Helpers.delay(1000);
    await Helpers.checkIfHasText('import-sheet-button-label', 'Import');
    await Helpers.tap('import-sheet-button');
    await Helpers.checkIfVisible('wallet-info-modal');
  });

  it('Should navigate to the Wallet screen after tapping on "Import Wallet"', async () => {
    await Helpers.tap('wallet-info-submit-button');
    await Helpers.checkIfVisible('wallet-screen');
  });

  it('Should say "vitalik.eth" in the Profile Screen header', async () => {
    await Helpers.swipe('wallet-screen', 'right');
    await Helpers.delay(2000);
    await Helpers.checkIfElementByTextIsVisible('0x4d14...dF85');
  });

  afterAll(async () => {
    // Reset the app state
    await device.clearKeychain();
  });
});