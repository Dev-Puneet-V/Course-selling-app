import { RecoilRoot } from "recoil";
import LandingPage from "./components/LandingPage";
import { BrowserRouter, Route, Routes } from "react-router-dom"; // Fixed import
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import CourseDetailedView from "./components/CourseDetailedView";
import DashboardLayout from "./components/DashboardLayout";
import Cources from "./components/Cources";

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />

            <Route element={<PrivateRoute />}>
              <Route path={"/"} element={<DashboardLayout />}>
                <Route path="/course/:type" element={<Cources />} />
                <Route
                  path="/course/watch/:id"
                  element={<CourseDetailedView />}
                />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
