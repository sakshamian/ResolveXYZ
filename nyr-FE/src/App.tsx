import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import ResponsiveAppBar from './Components/Navbar/ResponsiveAppBar'
import { AuthProvider } from './Context/AuthContext'
import Main from './Pages/Main/Main'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'
import SignIn from './Pages/Auth/Signin'
import SignUp from './Pages/Auth/SignUp'

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
            path="/protected"
            element={
              <ProtectedRoute>
                <Main />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sign-up"
            element={
              <SignUp />
            }
          />
          <Route
            path="/sign-in"
            element={
              <SignIn />
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
export default App
