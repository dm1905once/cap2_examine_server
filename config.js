require("dotenv").config();

const CLIENT_REDIRECT_URL = process.env.LOCALHOST || 'http://localhost:3000';
const SECRET = process.env.SECRET_KEY || 'test123';
const STRIPE_SECRET = process.env.STRIPE_SECRET || 'sk_test_51HcDauJMaHZnra3giyyZRYTwmYjCgkGmx1Ym9DvPXHtpFj3zEYQZXUNtp2OEBDwxcsHHbxwp81iUuCfSmgSAEENT00WHuvBPlM';
const PORT = +process.env.PORT || 3001;

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
