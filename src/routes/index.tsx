import Home from "../pages/home/Home";
import DefaultLayout from "../layouts/DefaultLayout";
import { RouteConfig } from "./RouteConfig";

const routes: RouteConfig[] = [
  {
    path: "/",
    element: (
      <DefaultLayout>
        <Home />
      </DefaultLayout>
    ),
  },
];

export default routes;
