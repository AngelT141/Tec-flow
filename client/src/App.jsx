import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import RutaProtegida from './components/layout/RutaProtegida.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Tickets from './pages/Tickets.jsx';
import NewTicket from './pages/NewTicket.jsx';
import TicketDetail from './pages/TicketDetail.jsx';
import Users from './pages/admin/Users.jsx';
import Categories from './pages/admin/Categories.jsx';
import Reports from './pages/admin/Reports.jsx';
import Metrics from './pages/agent/Metrics.jsx';

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
        <Route
          path="/admin/users"
          element={
            <RutaProtegida roles={['ADMIN']}>
              <Users />
            </RutaProtegida>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <RutaProtegida roles={['ADMIN']}>
              <Categories />
            </RutaProtegida>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <RutaProtegida roles={['ADMIN']}>
              <Reports />
            </RutaProtegida>
          }
        />
        <Route
          path="/metrics"
          element={
            <RutaProtegida roles={['AGENT', 'ADMIN']}>
              <Metrics />
            </RutaProtegida>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
