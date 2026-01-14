import Navbar from './components/layouts/Navbar';
import Routes from './routes/Router';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <Routes />
    </div>
  );
};

export default App;
