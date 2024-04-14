import { Route, Routes } from 'react-router';
import HomePage from './home';
import Login from './login';
import SignUp from './signup';
import FoodRoute from './food';
import { AuthLayout, MainLayout } from './_layout';
import { ValidationPage } from './validation';

function Pages() {
  console.log(process.env.NODE_ENV);
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/validation" element={<ValidationPage />} />
      </Route>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/food/*" element={<FoodRoute />} />
      </Route>
    </Routes>
  );
}

export default Pages;
