import { Route, Routes } from 'react-router';
import HomePage from './home';
import { Login, SignUp, ValidationPage, ValidationPasswordPage } from './auth';
import FoodRoute from './food';
import { AuthLayout, MainLayout } from './_layout';
import { SettingsPage } from './settings';
import { UsersPage } from './users';
import GuildRoute from './guild';
import { NotificationPage } from './notification';

function Pages() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/validation" element={<ValidationPage />} />
        <Route path="/password-reset" element={<ValidationPasswordPage />} />
      </Route>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/settings" element={<SettingsPage key="base" />} />
        <Route
          path="/settings/edit"
          element={<SettingsPage key="edit" editMode />}
        />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/friends" element={<UsersPage friendsMode />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/foods/*" element={<FoodRoute />} />
        <Route path="/guilds/*" element={<GuildRoute />} />
      </Route>
    </Routes>
  );
}

export default Pages;
