const emptyRoute = "/";
const anyRoute = "/*";
const eventsRoute = "/events";
const singleEventRoute = `${eventsRoute}/:eventId`;
const createEventRoute = `${eventsRoute}/create`;
const statisticsRoute = "/statistics";
const profileRoute = "/profile/:username";
const welcomeRoute = "/welcome";
const locationsRoute = "/locations";

const webappRoutes = {
  emptyRoute,
  eventsRoute,
  singleEventRoute,
  createEventRoute,
  statisticsRoute,
  profileRoute,
  welcomeRoute,
  anyRoute,
  locationsRoute,
};

export { webappRoutes };
