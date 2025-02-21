/**=========================================================
* BLISSIQ ADMIN React - v2.2.0
=========================================================
* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
Coded by www.creative-tim.com
 =========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the BLISSIQ ADMIN React are added here,
  You can add a new route, customize the routes and delete the routes here.
  Once you add a new route on this file it will be visible automatically on
  the Sidenav.
  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// BLISSIQ ADMIN React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

// University components
import CreateUniversity from "University/CreateUniversity";
import GETUniversity from "layouts/tables/GETUniversity";

// Grades components
// import CreateGrade from "./Grades/CreateGrade";

// Subject components
import CreateSubject from "./Subjects/CreateSubject";
import GetSubjects from "layouts/tables/GetSubjects";

// @mui icons
import Icon from "@mui/material/Icon";
import Users from "layouts/tables/Users";
import Teachers from "layouts/tables/Teacher";
import Banners from "layouts/tables/Banners";
import AddSubAdmin from "layouts/notifications/Addsubadmin";
import CreateSession from "layouts/notifications/CreateSession";
import GetSessions from "layouts/notifications/Getsession";
import { SidebarTempleteRoutes } from "templeteRouter";
import NewTempletesScreen from "layouts/templetes/newTemplate";
import LearningPathDetail from "layouts/tables/Learningpath";
import TopicManagement from "layouts/tables/Topics";
import SubtopicManagement from "layouts/tables/Subtopics";
import Vendors from "layouts/tables/Vendors";
import Categories from "layouts/tables/Categories";
import Workers from "layouts/tables/Workers";
import PostRequests from "layouts/tables/PostedJobs";
import NEWDashboard from "layouts/dashboard/New-dasbord";
import Orders from "layouts/tables/Orders";
import GovernmentJobs from "layouts/tables/Govtjobs";
import GovernmentJobApplications from "layouts/tables/Jobapplications";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <NEWDashboard />,
  },
  {
    type: "collapse",
    name: " Users", // Adding the Students menu item
    key: "Users",
    route: "/users",
    icon: (
      <i className="material-icons" style={{ color: "white" }}>
        group
      </i>
    ), // Icon for students
    component: <Users />, // The component to render
    layout: "/admin",
  },
  {
    type: "collapse",
    name: " Vendors", // Adding the Students menu item
    key: "Vendors",
    route: "/vendors",
    icon: (
      <i className="material-icons" style={{ color: "white" }}>
        group
      </i>
    ), // Icon for students
    component: <Vendors />, // The component to render
    layout: "/admin",
  },
  {
    type: "collapse",
    name: " Category", // Adding the Students menu item
    key: "Category",
    route: "/category",
    icon: (
      <i className="material-icons" style={{ color: "white" }}>
        group
      </i>
    ), // Icon for students
    component: <Categories />, // The component to render
    layout: "/admin",
  },
  {
    type: "collapse",
    name: " Workers", // Adding the Students menu item
    key: "Workers",
    route: "/Workers",
    icon: (
      <i className="material-icons" style={{ color: "white" }}>
        group
      </i>
    ), // Icon for students
    component: <Workers/>, // The component to render
    layout: "/admin",
  },
  {
    type: "collapse",
    name: "Banners", // Adding the Schools menu item
    key: "Banners",
    route: "/banners",
    icon: (
      <i className="material-icons" style={{ color: "white" }}>
        school
      </i>
    ), // Icon for schools
    component: <Banners />, // The component to render
    layout: "/admin",
  },
  
  {
    type: "collapse",
    name: "Job-Requests", // Adding the Schools menu item
    key: "Job-Requests",
    route: "/Job-requests",
    icon: (
      <i className="material-icons" style={{ color: "white" }}>
        school
      </i>
    ), // Icon for schools
    component: < PostRequests/>, // The component to render
    layout: "/admin",
  },
  {
    type: "collapse",
    name: "Orders", // Adding the Schools menu item
    key: "Orders",
    route: "/Orders",
    icon: (
      <i className="material-icons" style={{ color: "white" }}>
        school
      </i>
    ), // Icon for schools
    component: < Orders/>, // The component to render
    layout: "/admin",
  },
  {
    type: "collapse",
    name: "Govt Jobs", // Adding the Schools menu item
    key: "Govt Jobs",
    route: "/govt-jobs",
    icon: (
      <i className="material-icons" style={{ color: "white" }}>
        school
      </i>
    ), // Icon for schools
    component: < GovernmentJobs/>, // The component to render
    layout: "/admin",
  },
  {
    type: "collapse",
    name: "Apllications", // Adding the Schools menu item
    key: "Apllications",
    route: "/Applications",
    icon: (
      <i className="material-icons" style={{ color: "white" }}>
        school
      </i>
    ), // Icon for schools
    component: < GovernmentJobApplications/>, // The component to render
    layout: "/admin",
  },

  ...SidebarTempleteRoutes(),
  // {
  //   type: "collapse",
  //   name: "Tables",
  //   key: "tables",
  //   icon: <Icon fontSize="small">table_view</Icon>,
  //   route: "/tables",
  //   component: <Tables />,
  // },
  // {
  //   type: "collapse",
  //   name: "Billing",
  //   key: "billing",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/billing",
  //   component: <Billing />,
  // },
  // {
  //   type: "collapse",
  //   name: "RTL",
  //   key: "rtl",
  //   icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
  //   route: "/rtl",
  //   component: <RTL />,
  // },
  // {
  //   type: "collapse",
  //   name: "Notifications",
  //   key: "notifications",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/notifications",
  //   component: <Notifications />,
  // },
  // {
  //   type: "collapse",
  //   name: "Profile",
  //   key: "profile",
  //   icon: <Icon fontSize="small">person</Icon>,
  //   route: "/profile",
  //   component: <Profile />,
  // },
  {
 
    route: "/authentication/sign-in",
  
    component: <SignIn />,
  },
  {
 
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
];

export default routes;
