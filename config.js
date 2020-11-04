require("dotenv").config();

const CLIENT_REDIRECT_URL = process.env.LOCALHOST || 'http://localhost:3000';
const SECRET = process.env.SECRET_KEY || 'test123';
const STRIPE_SECRET = process.env.STRIPE_SECRET || 'sk_test_51HcDauJMaHZnra3gx1nCAIOtlE0laOp8v4SrED5uEM3LKnHbisV0AgjRqV5NyrMh4EgT809zM8yo1H0AqEVl7qZW00HNIR6huL';
const PORT = process.env.PORT || 3001;

let DB_URI;
if (process.env.NODE_ENV === "test") {
  DB_URI = "examine_test";
} else {
  DB_URI  = process.env.DATABASE_URL || 'examine';
}

console.log("Using database", DB_URI);

module.exports = {
  CLIENT_REDIRECT_URL,
  SECRET,
  PORT,
  DB_URI,
  STRIPE_SECRET
};
