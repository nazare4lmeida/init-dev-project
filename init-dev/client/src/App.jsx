import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import AccessRequestPage from './pages/AccessRequestPage'; 
import HomePage from './pages/HomePage'; 
import Dashboard from './pages/Dashboard';
import CoursePage from './pages/CoursePage';
import NotesPage from './pages/NotesPage';
import PrivateRoute from './components/PrivateRoute';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CourseManagementPage from './pages/CourseManagementPage'; 


function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main className='container mx-auto px-4 py-8 overflow-x-hidden'>
          <Routes>
            {/* Rotas Públicas */}
            <Route path='/' element={<HomePage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/access' element={<AccessRequestPage />} />
            <Route path='/about' element={<AboutPage />} />
            <Route path='/contact' element={<ContactPage />} />

            {/* Rotas Protegidas */}
            <Route path='/' element={<PrivateRoute />}>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/courses' element={<CoursePage />} />
              <Route path='/notes' element={<NotesPage />} />
              <Route path='/admin' element={<AdminDashboardPage />} />
              
                {/* NOVA ROTA DE DETALHES DO CURSO: Usa o slug como parâmetro dinâmico */}
              <Route path='/courses/:slug' element={<CourseManagementPage />} /> 

            </Route>
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;