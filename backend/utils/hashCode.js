const bcrypt = require('bcrypt');

const hashCode = async (code) => {
  if (code) {
    code = await bcrypt.hash(code, 10);
    return code;
  }
};

module.exports = hashCode;
