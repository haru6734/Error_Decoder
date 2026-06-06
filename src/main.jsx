// Render application in root using global ReactDOM and React components
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorDecoder />
  </React.StrictMode>
);
