const emptyRoute = "/";
const anyRoute = "/*";
const eventsRoute = "/events";
const singleEventRoute = `${eventsRoute}/:eventId`;
const createEventRoute = `${eventsRoute}/create`;
const statisticsRoute = "/statistics";
const profileRoute = "/profile/:id";
const updateProfileRoute = `${profileRoute}/update`;
const welcomeRoute = "/welcome";
const locationsRoute = "/locations";
const updateLocationRoute = `${locationsRoute}/update/:locationId`;
const createLocationRoute = `${locationsRoute}/create`;

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
  updateLocationRoute,
  createLocationRoute,
  updateProfileRoute,
};

export { webappRoutes };
