
// import crypto from 'crypto';


// export function hashUserPassword(password) {
// const salt = crypto. randomBytes (16).toString('hex');
// const hashedPassword = crypto.scryptSync (password, salt, 64);
// return hashed Password.toString('hex') + ':' + salt;
// }
// export function verify Password (stored Password, supplied Password) {
// const [hashed Password, salt] = stored Password.split(':');
// const hashedPassword Buf = Buffer.from(hashed Password, 'hex');
// const supplied Password Buf = crypto.scryptSync (supplied Password, salt, 64);
// return crypto. timingSafe Equal(hashed Password Buf, supplied Password Buf);
// }