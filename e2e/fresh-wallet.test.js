/* eslint-disable no-undef */
describe('Test a fresh wallet', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show Add Funds Interstitial on Wallet screen', async () => {
    await expect(element(by.id('goToProfile'))).toBeVisible();
    await expect(element(by.id('cameraHeaderButton'))).toBeVisible();
    await expect(
      element(by.id('AddFundsButton').withAncestor(by.id('EmptyAssetList')))
    ).toBeVisible();
    await expect(
      element(by.id('ImportWalletButton').withAncestor(by.id('EmptyAssetList')))
    ).toBeVisible();
    await expect(
      element(
        by.id('ImportWalletHelperText').withAncestor(by.id('EmptyAssetList'))
      )
    ).toBeVisible();
  });

  it('should show Profile masthead and Add Funds Interstitial on Profile screen', async () => {
    await element(by.id('goToProfile')).tap();
    await expect(element(by.id('goToWalletFromProfile'))).toBeVisible();
    await expect(element(by.id('goToSettings'))).toBeVisible();
    await expect(element(by.id('CopyTooltip'))).toBeVisible();
    await expect(element(by.id('AddressAbbreviation'))).toBeVisible();
    await expect(element(by.id('ReceiveButton'))).toBeVisible();
    await expect(
      element(by.id('AddFundsButton').withAncestor(by.id('ProfileScreen')))
    ).toBeVisible();
    await expect(
      element(by.id('ImportWalletButton').withAncestor(by.id('ProfileScreen')))
    ).toBeVisible();
    await expect(
      element(
        by.id('ImportWalletHelperText').withAncestor(by.id('ProfileScreen'))
      )
    ).toBeVisible();
  });
});
