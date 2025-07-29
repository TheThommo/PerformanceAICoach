import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { clientDebugger, withClientErrorLogging } from "./debug";

// Enhanced root rendering with error logging
const renderApp = withClientErrorLogging('main', 'application render', () => {
  clientDebugger.success('main', '🚀 Initializing Red2Blue client application');
  
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    clientDebugger.error('main', 'Root element not found', { elementId: 'root' });
    throw new Error('Root element #root not found');
  }
  
  clientDebugger.success('main', 'Root element found, creating React root');
  const root = createRoot(rootElement);
  
  clientDebugger.success('main', 'Rendering React application');
  root.render(<App />);
  
  clientDebugger.success('main', '✅ Red2Blue client application rendered successfully');
});

// Execute with error handling
try {
  renderApp();
} catch (error: any) {
  clientDebugger.error('main', '💥 Failed to render application', {
    error: error.message,
    stack: error.stack
  });
  
  // Fallback error display
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; color: red; font-family: monospace;">
        <h2>🚨 Application Failed to Load</h2>
        <p><strong>Error:</strong> ${error.message}</p>
        <p><strong>Check Console:</strong> Open developer tools for detailed diagnostics</p>
        <p><strong>Environment:</strong> ${import.meta.env.MODE}</p>
        <button onclick="window.location.reload()" style="margin-top: 10px; padding: 8px 16px;">
          Reload Application
        </button>
      </div>
    `;
  }
}
