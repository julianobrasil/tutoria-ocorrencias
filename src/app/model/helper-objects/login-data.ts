// // <reference path="../../../../node_modules/@types/crypto-js/index.d.ts" />
// /// <reference types="crypto-js" />
// import * as CryptoJS from 'crypto-js';

export class LoginData {
  // public static key = CryptoJS.enc.Hex.parse('3#$%^&%^@#54677|');

  constructor(public email: string, public senha: string) {}
}
