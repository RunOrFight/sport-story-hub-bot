const emptyRoute = "/";
const eventsRoute = "/events";
const singleEventRoute = `${eventsRoute}/:id`
const createEventRoute = `${eventsRoute}/create`

const routeMap = {
    emptyRoute,
    eventsRoute,
    singleEventRoute,
    createEventRoute
}

export {routeMap}
