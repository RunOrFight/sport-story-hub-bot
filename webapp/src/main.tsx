import ReactDOM from "react-dom/client";
import { Route, Routes } from "react-router-dom";
import { EventsPage } from "./EventsPage/EventsPage.tsx";
import { CreateEventForm } from "./CreateEventForm.tsx";
import { routeMap } from "./routeMap.ts";
import { SingleEventPage } from "./SingleEventPage/SingleEventPage.tsx";
import { Layout } from "./Layout/Layout.tsx";
import "./main.css";
import { StatisticsPage } from "./StatisticsPage/StatisticsPage.tsx";
import { ProfilePage } from "./ProfilePage/ProfilePage.tsx";
import { isDev } from "./Utils/OneLineUtils.ts";
import { Provider } from "react-redux";
import { WelcomePage } from "./WelcomePage/WelcomePage.tsx";
import { history, store } from "./Store/CreateStore.ts";
import { ReduxRouter } from "@lagunovsky/redux-react-router";

document.body.setAttribute("data-dev", String(isDev));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ReduxRouter history={history}>
      <Routes>
        <Route path={routeMap.emptyRoute} element={<Layout />}>
          <Route path={routeMap.eventsRoute} element={<EventsPage />} />
          <Route
            path={routeMap.singleEventRoute}
            element={<SingleEventPage />}
          />
          <Route path={routeMap.statisticsRoute} element={<StatisticsPage />} />
          <Route path={routeMap.profileRoute} element={<ProfilePage />} />
        </Route>
        <Route path={routeMap.createEventRoute} element={<CreateEventForm />} />
        <Route path={routeMap.welcomeRoute} element={<WelcomePage />} />
      </Routes>
    </ReduxRouter>
  </Provider>,
);
