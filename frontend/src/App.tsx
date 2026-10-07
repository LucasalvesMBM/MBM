import { Routes, Route } from 'react-router-dom';
import Header from './componentes/header';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import People from './pages/People';

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tarefas" element={<Tasks />} />
        <Route path="/pessoas" element={<People />} />
      </Routes>
    </>
  );
}