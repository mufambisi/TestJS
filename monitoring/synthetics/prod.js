/**
 * Start : Do not edit
 */
const TIMEOUT = 30 * 1000;
const BASE_URL = "https://www.originenergy.com.au";
const DASHBOARD_URL = BASE_URL + "/my";

const USERNAME = $secure.KRAKEN_EMAIL;
const PASSWORD = $secure.KRAKEN_PASSWORD;

const USABILLA_ASSETS_URL = "d6tizftlrpuof.cloudfront.net";
/**
 * End : Do not edit
 */

const doLogin = () => {
  // Element Locators
  const emailInputLocator = () => $driver.By.css("input[data-id=login_usernameInput]");
  const passwordInputLocator = () => $driver.By.css("input[type=password]");
  const continueButtonLocator = () => $driver.By.css('button[type="submit"]');

  // provide email address
  $browser.wait($driver.until.elementIsVisible($browser.findElement(emailInputLocator())), TIMEOUT);
  $browser.findElement(emailInputLocator()).clear();
  $browser.findElement(emailInputLocator()).sendKeys(USERNAME);

  // provide password
  $browser.wait(
    $driver.until.elementIsVisible($browser.findElement(passwordInputLocator())),
    TIMEOUT,
  );
  $browser.findElement(passwordInputLocator()).clear();
  $browser.findElement(passwordInputLocator()).sendKeys(PASSWORD);

  $browser.findElement(continueButtonLocator()).click();
};

/* Helpers */
const waitForElement = (element) => $browser.waitForAndFindElement(element, TIMEOUT);
const getByDataId = (dataId) => $driver.By.css(`[data-id="${dataId}"]`);

/* Selectors */
const dashboard = () => getByDataId("dashboard");
const accountCard = () => getByDataId("account-summary");
const contactCard = () => getByDataId("contact-card");

/* Deeplink to profile page */
$browser.get(DASHBOARD_URL);

/* Log In */
doLogin();

waitForElement(dashboard());
waitForElement(accountCard());

waitForElement(contactCard());
