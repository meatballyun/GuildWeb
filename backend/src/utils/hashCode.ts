import bcrypt from 'bcrypt';

export const toHash = async (code: string) => {
  if (code && process.env.SALT) {
    code = await bcrypt.hash(code, parseInt(process.env.SALT));
    return code;
  }
};

export const comparer = async (password: string, code: string) => {
  bcrypt.compare(password, code, (err, result) => {
    if (err) return err;
    if (result) return true;
    return 'Invalid password';
  });
};
