const emptyRoute = "/";
const eventsRoute = "/events";
const singleEventRoute = `${eventsRoute}/:id`;
const createEventRoute = `${eventsRoute}/create`;
const statisticsRoute = "/statistics";
const profileRoute = "/profile/:username";

const routeMap = {
  emptyRoute,
  eventsRoute,
  singleEventRoute,
  createEventRoute,
  statisticsRoute,
  profileRoute,
};

export { routeMap };
