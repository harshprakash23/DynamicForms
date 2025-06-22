import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/Footer';
import Home from './pages/home';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CreateForm from './components/CreateForm';
import MyForms from './components/MyForms';
import RespondForm from './components/RespondForm';
import ViewResponses from './components/ViewResponses';
import EditForm from './components/EditForm';
import PageNotFound from './components/PageNotFound';

// Layout wrapper component to handle conditional rendering
const Layout = ({ children }) => {
  const location = useLocation();
  
  // Pages that should have full-screen layout without navbar/footer
  const fullScreenPages = ['/login', '/register'];
  const isFullScreen = fullScreenPages.includes(location.pathname);
  
  // Pages that should not show footer
  const noFooterPages = ['/dashboard', '/create-form', '/forms'];
  const shouldShowFooter = !noFooterPages.some(page => location.pathname.startsWith(page)) && !isFullScreen;
  
  if (isFullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {children}
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />
      <div className="flex-grow">
        {children}
      </div>
      {shouldShowFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-form" element={<CreateForm />} />
          <Route path="/forms" element={<MyForms />} />
          <Route path="/forms/:id/respond" element={<RespondForm />} />
          <Route path="/forms/:id/responses" element={<ViewResponses />} />
          <Route path="/forms/:id/edit" element={<EditForm />} />
          <Route path="/privacy-policy" element={<PageNotFound />} />
          <Route path="/terms-of-service" element={<PageNotFound />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;