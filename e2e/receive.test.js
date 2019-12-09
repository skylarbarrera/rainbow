/* eslint-disable no-undef */
describe('Test the receive modal', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should see Receive modal after tapping Receive', async () => {
    await element(by.id('goToProfile')).tap();
    await element(by.id('ReceiveButton')).tap();
    await expect(element(by.id('ReceiveModal'))).toBeVisible();
  });

  it('should see ProfileScreen after closing Receive modal', async () => {
    await element(by.id('goToProfile')).tap();
    await element(by.id('ReceiveButton')).tap();
    await expect(element(by.id('ReceiveModal'))).toBeVisible();
    await element(
      by.id('ModalDoneButton').withAncestor(by.id('ReceiveModal'))
    ).tap();
    await expect(element(by.id('ReceiveModal'))).toBeNotVisible();
    await expect(element(by.id('ReceiveButton'))).toBeVisible();
  });

  it('should see Profile screen after swiping Receive modal down', async () => {
    await element(by.id('goToProfile')).tap();
    await element(by.id('ReceiveButton')).tap();
    await expect(element(by.id('ReceiveModal'))).toBeVisible();
    await element(by.id('ReceiveModal')).swipe('down', 'fast', 0.5);
    await expect(element(by.id('ReceiveModal'))).toBeNotVisible();
    await expect(element(by.id('ReceiveButton'))).toBeVisible();
  });
});
