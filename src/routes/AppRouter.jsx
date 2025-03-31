import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "../pages/SplashScreen";
import Login from "../pages/Auth/Login";
import Welcome from "../pages/Welcome";
import RegisterType from "../pages/RegisterType";
import RegisterTeacher from "../pages/RegisterTeacher";
import RegisterStudent from "../pages/RegisterStudent";
import RegisterTeacherStep2 from "../pages/RegisterTeacherStep2";
import RegisterAcademicSubjects from "../pages/subjects/RegisterAcademicSubjects";
import RegisterNonAcademicSubjects from "../pages/subjects/RegisterNonAcademicSubjects";
import CodeVerify from "../pages/CodeVerify";
import HomeScreen from "../pages/HomeScreen";
import ForgotPassword from "../pages/Auth/ForgotPassword"; // Ruta para olvidé mi contraseña
import EmailVerify from "../pages/Auth/EmailVerify"; // Nueva ruta para verificación de correo electrónico

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
        <Route path="/register/teacher/step2" element={<RegisterTeacherStep2 />} />
        <Route path="/register/teacher/subjects/academic" element={<RegisterAcademicSubjects />} />
        <Route path="/register/teacher/subjects/non-academic" element={<RegisterNonAcademicSubjects />} />
        <Route path="/verify/teacher" element={<CodeVerify steps={3} />} />
        <Route path="/verify/student" element={<CodeVerify steps={2} />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify/email" element={<EmailVerify />} /> {/* Nueva ruta de verificación por correo */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
