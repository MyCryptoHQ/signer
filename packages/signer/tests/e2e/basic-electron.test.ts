import app from './setupElectron';

jest.setTimeout(30000);

describe('Basic E2E tests', () => {
  beforeAll(async () => {
    await app.start();
  });

  afterAll(async () => {
    if (app && app.isRunning()) {
      await app.stop();
    }
  });

  it('opens a window', async () => {
    const count = await app.client.getWindowCount();
    expect(count).toEqual(1);
  });

  it('has the correct title', async () => {
    const title = await app.client.getTitle();
    expect(title).toEqual('Signer');
  });

  it('renders the initial view', async () => {
    const spinner = await app.client.$('#loading-spinner');
    const exists = await spinner.isExisting();
    expect(exists).toBe(true);
  });
});
