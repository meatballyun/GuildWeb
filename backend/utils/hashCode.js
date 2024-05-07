const bcrypt = require('bcrypt');

const hasher = async (code) => {
  if (code) {
    code = await bcrypt.hash(code, 10);
    return code;
  }
};

const comparer = async (password, code) => {
  bcrypt.compare(password, code, (err, result) => {
    console.log(err);
    if (err) return err;
    if (result) return true;
    console.log(result);
    return 'Invalid password';
  });
};

module.exports = { hasher, comparer };
