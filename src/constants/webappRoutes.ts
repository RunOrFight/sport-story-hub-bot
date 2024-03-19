const emptyRoute = "/";
const anyRoute = "/*";
const eventsRoute = "/events";
const singleEventRoute = `${eventsRoute}/:eventId`;
const adminRoute = "/admin";
const statisticsRoute = "/statistics";
const profileRoute = "/profile/:id";
const updateProfileRoute = `${profileRoute}/update`;
const welcomeRoute = "/welcome";
const locationsRoute = "/location";
const manageEventsRoute = `${adminRoute}${eventsRoute}`;
const createEventRoute = `${manageEventsRoute}/create`;
const updateEventRoute = `${manageEventsRoute}/update/:eventId`;
const updateLocationRoute = `${adminRoute}${locationsRoute}/update/:locationId`;
const createLocationRoute = `${adminRoute}${locationsRoute}/create`;
const manageSingleEventRoute = `${adminRoute}${singleEventRoute}`;
const createSingleEventTeamRoute = `${manageSingleEventRoute}/team/create`;
const updateSingleEventTeamRoute = `${manageSingleEventRoute}/team/update/:teamId`;

const webappRoutes = {
  emptyRoute,
  eventsRoute,
  singleEventRoute,
  manageEventsRoute,
  statisticsRoute,
  profileRoute,
  welcomeRoute,
  anyRoute,
  locationsRoute,
  updateLocationRoute,
  createLocationRoute,
  updateProfileRoute,
  createEventRoute,
  updateEventRoute,
  manageSingleEventRoute,
  updateSingleEventTeamRoute,
  createSingleEventTeamRoute,
};

export { webappRoutes };
