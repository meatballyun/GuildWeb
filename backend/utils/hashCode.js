const bcrypt = require('bcrypt');

const hasher = async (code) => {
  if (code) {
    code = await bcrypt.hash(code, 10);
    return code;
  }
};

const comparer = async (password, code) => {
  bcrypt.compare(password, code, (err, result) => {
    if (err) return err;
    if (result) return true;
    return 'Invalid password';
  });
};

module.exports = { hasher, comparer };
