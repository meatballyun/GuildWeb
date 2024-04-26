import { Route, Routes } from 'react-router';
import HomePage from './home';
import Login from './login';
import SignUp from './signup';
import FoodRoute from './food';
import { AuthLayout, MainLayout } from './_layout';
import { SettingsPage } from './settings';
import { ValidationPage } from './validation';
import { UsersPage } from './users';
import GuildRoute from './guild';

function Pages() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/validation" element={<ValidationPage />} />
      </Route>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/settings" element={<SettingsPage key="base" />} />
        <Route
          path="/settings/edit"
          element={<SettingsPage key="edit" editMode />}
        />
        <Route path="/friends" element={<UsersPage friendsMode />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/foods/*" element={<FoodRoute />} />
        <Route path="/guilds/*" element={<GuildRoute />} />
      </Route>
    </Routes>
  );
}

export default Pages;
