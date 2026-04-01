import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import { AddMoment } from './components/AddMoment';
import Gallery from './components/Gallery';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/adicionar" element={<AddMoment />} />
      <Route path="/galeria" element={<Gallery />} />
    </Routes>
  );
}
