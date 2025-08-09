browser.webNavigation.onCommitted.addListener(
  () => {
    console.log("Going to a new link...");
  }
);