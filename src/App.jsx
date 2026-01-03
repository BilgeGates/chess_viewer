import Navbar from "./components/layouts/Navbar";
import AppRoutes from "./routes/Router";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <AppRoutes />
    </div>
  );
};

export default App;
