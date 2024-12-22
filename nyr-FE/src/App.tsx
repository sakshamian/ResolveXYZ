import { BrowserRouter, Route, Router, Routes } from 'react-router'
import './App.css'
import ResponsiveAppBar from './Components/Navbar/ResponsiveAppBar'
import { AuthProvider } from './Context/AuthContext'
import Main from './Pages/Main/Main'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'

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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
export default App
