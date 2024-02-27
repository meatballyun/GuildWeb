import { api } from '../api';

const PrivateRoute = ({ children }) => {
  const getAuth = async () => {
    api.auth.checkAuth();
  };

  console.log();
};
