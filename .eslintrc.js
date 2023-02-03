module.exports = {
  extends: ["@s4p/eslint-config"],
  globals: {
    $: false,
    window: false,
    document: false,
    alert: false,
    btoa: false,
    fetch: false,
    navigator: false,
    Notification: false,
  },
};
