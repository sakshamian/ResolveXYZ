import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import ResponsiveAppBar from './Components/Navbar/ResponsiveAppBar'
import { AuthProvider } from './Context/AuthContext'
import Main from './Pages/Main/Main'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'
import SignIn from './Pages/Auth/Login'
import MyResolutions from './Pages/User/MyResolutions'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"
            element={
              <>
                <ResponsiveAppBar />
                <Main />
              </>
            }
          />
          <Route
            path="/my-posts"
            element={
              <ProtectedRoute>
                <ResponsiveAppBar />
                <MyResolutions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sign-in"
            element={
              <>
                <ResponsiveAppBar />
                <SignIn />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
export default App
