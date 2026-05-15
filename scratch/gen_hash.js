const bcrypt = require('bcryptjs');
const password = '@#isamchajia2003';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
