/* eslint-disable no-undef */
describe('Test the settings modal', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should see Settings screen after tapping Settings header button', async () => {
    await element(by.id('goToProfile')).tap();
    await element(by.id('goToSettings')).tap();
    await expect(element(by.id('SettingsModal'))).toBeVisible();
    await expect(element(by.id('BackupSetting'))).toBeVisible();
    await expect(element(by.id('NetworkSetting'))).toBeVisible();
    await expect(
      element(
        by
          .id('ListItemArrowGroupStringValue')
          .withAncestor(by.id('NetworkSetting'))
      )
    ).toBeVisible();
    await expect(
      element(
        by
          .id('ListItemArrowGroupStringValue')
          .withAncestor(by.id('NetworkSetting'))
      )
    ).toHaveText('Mainnet');
    await expect(element(by.id('CurrencySetting'))).toBeVisible();
    await expect(
      element(
        by
          .id('ListItemArrowGroupStringValue')
          .withAncestor(by.id('CurrencySetting'))
      )
    ).toBeVisible();
    await expect(
      element(
        by
          .id('ListItemArrowGroupStringValue')
          .withAncestor(by.id('CurrencySetting'))
      )
    ).toHaveText('USD');
    await expect(element(by.id('LanguageSetting'))).toBeVisible();
    await expect(
      element(
        by
          .id('ListItemArrowGroupStringValue')
          .withAncestor(by.id('LanguageSetting'))
      )
    ).toBeVisible();
    await expect(
      element(
        by
          .id('ListItemArrowGroupStringValue')
          .withAncestor(by.id('LanguageSetting'))
      )
    ).toHaveText('English');
    await expect(element(by.id('SettingsImportWallet'))).toBeVisible();
    await expect(element(by.id('FollowUs'))).toBeVisible();
    await expect(element(by.id('LeaveFeedback'))).toBeVisible();
    await expect(element(by.id('ReviewRainbow'))).toBeVisible();
  });

  /*
  it('should see ProfileScreen after closing Settings modal', async () => {
    await element(by.id('goToProfile')).tap();
    await element(by.id('goToSettings')).tap();
    await element(
      by.id('ModalDoneButton').withAncestor(by.id('SettingsModal'))
    ).tap();
    await expect(element(by.id('SettingsModal'))).toBeNotVisible();
    await expect(element(by.id('goToSettings'))).toBeVisible();
  });
  */
});
