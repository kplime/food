import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { RecipeListPage } from './pages/RecipeListPage'
import { RecipeDetailPage } from './pages/RecipeDetailPage'
import { RestaurantListPage } from './pages/RestaurantListPage'
import { CommunityBoardPage } from './pages/CommunityBoardPage'
import { CommunityPostDetailPage } from './pages/CommunityPostDetailPage'
import { AuthPage } from './pages/AuthPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { LanguageProvider } from './i18n/LanguageContext'
import { AuthProvider } from './auth/AuthContext'

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/recipes" element={<RecipeListPage />} />
              <Route path="/recipes/:slug" element={<RecipeDetailPage />} />
              <Route path="/restaurants" element={<RestaurantListPage />} />
              <Route path="/restaurants/search" element={<Navigate to="/restaurants" replace />} />
              <Route path="/community" element={<CommunityBoardPage />} />
              <Route path="/community/:id" element={<CommunityPostDetailPage />} />
              <Route path="/login" element={<AuthPage initialMode="login" />} />
              <Route path="/register" element={<AuthPage initialMode="register" />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
