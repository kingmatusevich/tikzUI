require("dotenv").config();
const { notarize } = require("electron-notarize");

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== "darwin") {
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  const password = `@keychain:AC_PASSWORD`;
  return await notarize({
    appBundleId: "ar.com.stanet.tikzUI.electron",
    appPath: `${appOutDir}/${appName}.app`,
    appleId: "jmatusevichpose@gmail.com",
    appleIdPassword: password,
    ascProvider: "D5YR5XE2X6",
  });
};
