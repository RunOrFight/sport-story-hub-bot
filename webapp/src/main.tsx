import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {EventsPage} from "./EventsPage.tsx";
import {CreateEventForm} from "./CreateEventForm.tsx";
import {routeMap} from "./routeMap.ts";
import {SingleEventPage} from "./SingleEventPage.tsx";


const router = createBrowserRouter([
    {
        path: routeMap.emptyRoute,
        element: <EventsPage/>,
        index: true
    },
    {
        path: routeMap.eventsRoute,
        element: <EventsPage/>,
    },
    {
        path: routeMap.singleEventRoute,
        element: <SingleEventPage/>
    },
    {
        path: routeMap.createEventRoute,
        element: <CreateEventForm/>
    }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router}/>
)
