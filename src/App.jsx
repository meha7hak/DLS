import AppRoutes from "./routes/AppRoutes.jsx";

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ flex: 1 }}>
        <AppRoutes />
      </div>
      <footer style={{ textAlign: "center", padding: "20px", background: "#f8fafc", borderTop: "1px solid #e2e8f0", fontSize: "14px", color: "#64748b" }}>
        Made with ❤️ by Devs -LKCTC @ 2026 and copyright to <a href="https://github.com/meha7hak">github.com/meha7hak</a>
      </footer>
    </div>
  );
}

export default App;