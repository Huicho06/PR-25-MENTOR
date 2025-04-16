import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainScreen from "./pages/MainScreen";  // Asegúrate de que la ruta esté bien
import ProfileScreen from "./pages/ProfileScreen";  // Ruta para el perfil
import ChatsScreen from "./pages/ChatsScreen";  // Ruta para los chats

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/main" element={<MainScreen />} />
        <Route path="/profileData" element={<ProfileScreen />} />
        <Route path="/chats" element={<ChatsScreen />} />
        {/* Agrega más rutas si es necesario */}
      </Routes>
    </Router>
  );
}

export default App;
