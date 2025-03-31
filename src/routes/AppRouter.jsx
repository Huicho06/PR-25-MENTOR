import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "../pages/SplashScreen";
import Login from "../pages/Auth/Login";
import Welcome from "../pages/Welcome";
import RegisterType from "../pages/RegisterType";
import RegisterTeacher from "../pages/RegisterTeacher";
import RegisterStudent from "../pages/RegisterStudent";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registertype" element={<RegisterType />} />
        <Route path="/register/teacher" element={<RegisterTeacher />} />
        <Route path="/register/student" element={<RegisterStudent />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
