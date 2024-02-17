import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { EventsPage } from "./EventsPage/EventsPage.tsx";
import { CreateEventForm } from "./CreateEventForm.tsx";
import { routeMap } from "./routeMap.ts";
import { SingleEventPage } from "./SingleEventPage.tsx";
import { Layout } from "./Layout/Layout.tsx";
import "./main.css";
import { StatisticsPage } from "./StatisticsPage/StatisticsPage.tsx";
import { ProfilePage } from "./ProfilePage/ProfilePage.tsx";

const router = createBrowserRouter([
  {
    path: routeMap.emptyRoute,
    element: <Layout />,
    errorElement: <Navigate to={routeMap.eventsRoute} />,
    children: [
      {
        path: routeMap.eventsRoute,
        element: <EventsPage />,
      },
      {
        path: routeMap.singleEventRoute,
        element: <SingleEventPage />,
      },
      {
        path: routeMap.statisticsRoute,
        element: <StatisticsPage />,
      },
      {
        path: routeMap.profileRoute,
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: routeMap.createEventRoute,
    element: <CreateEventForm />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
