import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import RutaProtegida from './components/layout/RutaProtegida.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Tickets from './pages/Tickets.jsx';
import NewTicket from './pages/NewTicket.jsx';
import TicketDetail from './pages/TicketDetail.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <RutaProtegida>
              <Tickets />
            </RutaProtegida>
          }
        />
        <Route
          path="/tickets/new"
          element={
            <RutaProtegida>
              <NewTicket />
            </RutaProtegida>
          }
        />
        <Route
          path="/tickets/:id"
          element={
            <RutaProtegida>
              <TicketDetail />
            </RutaProtegida>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
