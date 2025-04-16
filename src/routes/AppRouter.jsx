import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "../pages/SplashScreen";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register"; {/* Cambié el nombre de "Login" a "Register" */}
import Welcome from "../pages/Welcome";
import RegisterTeacherStep2 from "../pages/RegisterTeacherStep2";
import RegisterAcademicSubjects from "../pages/subjects/RegisterAcademicSubjects";
import RegisterNonAcademicSubjects from "../pages/subjects/RegisterNonAcademicSubjects";
import CodeVerify from "../pages/CodeVerify";
import HomeScreen from "../pages/HomeScreen";
import ForgotPassword from "../pages/Auth/ForgotPassword"; // Ruta para olvidé mi contraseña
import EmailVerify from "../pages/Auth/EmailVerify"; // Nueva ruta para verificación de correo electrónico
import ChangePassword from "../pages/Auth/ChangePassword";
import MainScreen from "../pages/MainScreen";
import MainScreenTeacher from "../pages/MainScreenTeacher";
import CreateProfileStudent from "../pages/CreateProfileStudent";

import CreateProfileTeacher from "../pages/CreateProfileTeacher";
import UpdateProfileTeacher from "../pages/UpdateProfileTeacher";
import UpdateProfileStudent from "../pages/UpdateProfileStudent";
import ProfileScreen from "../pages/ProfileScreen";
import ProfileScreenTeacher from "../pages/ProfileScreenTeacher";


const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* Ya está bien el nombre aquí */}

        <Route path="/register/teacher/step2" element={<RegisterTeacherStep2 />} />
        <Route path="/register/teacher/subjects/academic" element={<RegisterAcademicSubjects />} />
        <Route path="/register/teacher/subjects/non-academic" element={<RegisterNonAcademicSubjects />} />
        <Route path="/verify/teacher" element={<CodeVerify steps={3} />} />
        <Route path="/verify/student" element={<CodeVerify steps={2} />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify/email" element={<EmailVerify />} /> {/* Nueva ruta de verificación por correo */}
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/main" element={<MainScreen />} />
        <Route path="/mainTeacher" element={<MainScreenTeacher />} />
        <Route path="/CreateProfileStudent" element={<CreateProfileStudent />} />
        <Route path="/CreateProfileTeacher" element={<CreateProfileTeacher />} />
        <Route path="/UpdateProfileTeacher" element={<UpdateProfileTeacher />} />
        <Route path="/UpdateProfileStudent" element={<UpdateProfileStudent />} />
        <Route path="/ProfileScreen" element={<ProfileScreen />} />
        <Route path="/ProfileScreenTeacher" element={<ProfileScreenTeacher />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
