import ReactDOM from "react-dom/client";
import { Route, Routes } from "react-router-dom";
import { EventsPage } from "./EventsPage/EventsPage.tsx";
import { webappRoutes } from "../../src/constants/webappRoutes.ts";
import { SingleEventPage } from "./SingleEventPage/SingleEventPage.tsx";
import { Layout } from "./Layout/Layout.tsx";
import "./main.css";
import { StatisticsPage } from "./StatisticsPage/StatisticsPage.tsx";
import { ProfilePage } from "./ProfilePage/ProfilePage.tsx";
import { isDev } from "./Utils/OneLineUtils.ts";
import { Provider } from "react-redux";
import { WelcomePage } from "./WelcomePage/WelcomePage.tsx";
import { history, store } from "./Store/App/CreateStore.ts";
import { ReduxRouter } from "@lagunovsky/redux-react-router";
import { LocationsPage } from "./AdminUI/Locations/LocationsPage/LocationsPage.tsx";
import { UpdateLocationPage } from "./AdminUI/Locations/UpdateLocationPage/UpdateLocationPage.tsx";
import { CreateLocationPage } from "./AdminUI/Locations/CreateLocationPage/CreateLocationPage.tsx";
import { UpdateProfilePage } from "./UpdateProfilePage/UpdateProfilePage.tsx";
import { ManageEventsPage } from "./AdminUI/Events/ManageEventsPage.tsx";
import { CreateEventForm } from "./AdminUI/Events/CreateEventForm.tsx";

document.body.setAttribute("data-dev", String(isDev));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ReduxRouter history={history}>
      <Routes>
        <Route path={webappRoutes.emptyRoute} element={<Layout />}>
          <Route path={webappRoutes.eventsRoute} element={<EventsPage />} />
          <Route
            path={webappRoutes.singleEventRoute}
            element={<SingleEventPage />}
          />
          <Route
            path={webappRoutes.statisticsRoute}
            element={<StatisticsPage />}
          />
          <Route path={webappRoutes.profileRoute} element={<ProfilePage />} />
        </Route>
        <Route
          path={webappRoutes.manageEventsRoute}
          element={<ManageEventsPage />}
        />

        <Route
          path={webappRoutes.createEventRoute}
          element={<CreateEventForm />}
        />
        <Route path={webappRoutes.locationsRoute} element={<LocationsPage />} />

        <Route
          path={webappRoutes.updateLocationRoute}
          element={<UpdateLocationPage />}
        />

        <Route
          path={webappRoutes.createLocationRoute}
          element={<CreateLocationPage />}
        />

        <Route
          path={webappRoutes.updateProfileRoute}
          element={<UpdateProfilePage />}
        />

        <Route path={webappRoutes.welcomeRoute} element={<WelcomePage />} />
      </Routes>
    </ReduxRouter>
  </Provider>,
);
