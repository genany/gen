import puppeteer from 'puppeteer';
import jest from 'jest';

describe('Login', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ args: ['--no-sandbox'], timeout: 0 });
  });

  beforeEach(async () => {
    page = await browser.newPage();
    // await page.goto('http://localhost:3000/#/user/login', {
    //   waitUntil: 'networkidle2'
    // })
  });

  // afterEach(() => page.close())
  // afterAll(() => browser.close())

  it('user login fail', async () => {
    await page.setViewport({ width: 1000, height: 1000 });
    await page.goto('http://localhost:3000/#/user/login');
    await page.waitForSelector(
      '.ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input-affix-wrapper > #name'
      // { timeout: 2000 }
    );
    await page.click(
      '.ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input-affix-wrapper > #name'
    );
    await page.type(
      '.ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input-affix-wrapper > #name',
      'admin'
    );

    await page.waitForSelector(
      '.ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input-affix-wrapper > #password'
    );
    await page.click(
      '.ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input-affix-wrapper > #password'
    );
    await page.type(
      '.ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input-affix-wrapper > #password',
      'asd402402test'
    );
    await page.click(
      '.ant-row > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-btn'
    );
    // await page.waitFor(2000)
    await page.waitForSelector(
      '.ant-message-custom-content .ant-message-error',
      { timeout: 10000 }
    );
  });

  it('user login success', async () => {
    await page.setViewport({ width: 1000, height: 1000 });
    await page.goto('http://localhost:3000/#/user/login');
    await page.waitForSelector(
      '.ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input-affix-wrapper > #name',
      { timeout: 2000 }
    );
    await page.click(
      '.ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input-affix-wrapper > #name'
    );
    await page.type(
      '.ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input-affix-wrapper > #name',
      'admin'
    );
    await page.waitForSelector(
      '.ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input-affix-wrapper > #password'
    );
    await page.click(
      '.ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input-affix-wrapper > #password'
    );
    await page.type(
      '.ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-input-affix-wrapper > #password',
      'asd402402'
    );
    await page.click(
      '.ant-row > .ant-form-item-control-wrapper > .ant-form-item-control > .ant-form-item-children > .ant-btn'
    );

    await page.waitFor(() => {
      let html = document.body.innerHTML;

      return html.indexOf('<h1>运营管理平台</h1>') >= 0;
    });

    // await page.waitFor(5000)
    // await page.waitFor(5000, { timeout: 10000 })
    // const text = await page.evaluate(() => document.body.innerHTML, {
    //   timeout: 10000
    // })
    // console.log(text)
    // expect(text).toContain('<h1>运营管理平台</h1>')
  });
});
