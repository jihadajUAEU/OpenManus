import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';

import LLMConfiguration from './components/LLMConfiguration';
import TerminalInterface from './components/TerminalInterface';
import FlowManagement from './components/FlowManagement';
import AgentConfiguration from './components/AgentConfiguration';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <img
                  src="/logo.png"
                  alt="OpenManus"
                  className="h-8 w-auto"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/32';
                  }}
                />
                <span className="ml-2 text-xl font-bold">OpenManus</span>
              </div>
              <div className="ml-6 flex space-x-4">
                <Link to="/" className="nav-link">
                  Terminal
                </Link>
                <Link to="/config" className="nav-link">
                  Configuration
                </Link>
                <Link to="/agents" className="nav-link">
                  Agents
                </Link>
                <Link to="/flow" className="nav-link">
                  Flow
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={
              <div className="space-y-6">
                <TerminalInterface />
              </div>
            } />
            <Route path="/config" element={
              <div className="space-y-6">
                <LLMConfiguration />
              </div>
            } />
            <Route path="/agents" element={
              <div className="space-y-6">
                <AgentConfiguration />
              </div>
            } />
            <Route path="/flow" element={
              <div className="space-y-6">
                <FlowManagement />
              </div>
            } />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
};

export default App;

// Add these styles to index.css
const styles = `
.nav-link {
  @apply px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50;
}

.nav-link.active {
  @apply bg-gray-100 text-gray-900;
}
`;

// Create a style element and append it to the document head
const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.head.appendChild(styleElement);
