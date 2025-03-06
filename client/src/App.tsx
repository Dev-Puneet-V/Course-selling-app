import { RecoilRoot } from "recoil";
import LandingPage from "./components/LandingPage";
import { BrowserRouter, Route, Routes } from "react-router-dom"; // Fixed import
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./components/Home";
import AdminDashboard from "./components/AdminDashboard";
import CourseDetailedView from "./components/CourseDetailedView";
import UserHome from "./components/UserDashboard";

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />

            {/* Private Routes */}
            <Route element={<PrivateRoute />}>
              {/* <Route path="/home" element={<AdminDashboard />} /> */}
              {/* <Route path="/course/:id" element={<CourseDetailedView />} /> */}
              <Route path="/home" element={<UserHome />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
