import { Container } from 'react-bootstrap';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Home from './pages/Home';
import Submissions from './pages/Submissions';

function App() {
  return (
    <Router>
      <NavigationBar />
      <Container className="my-5" style={{ width: '100%', maxWidth: '90%' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/submissions" element={<Submissions />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
