const hashString = (str) => {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash ^ ((hash << 5) + hash) ^ str.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const toBase64 = (num) => {
  const byteArray = new Uint8Array([
    (num >>> 24) & 0xff,
    (num >>> 16) & 0xff,
    (num >>> 8) & 0xff,
    num & 0xff,
  ]);
  return btoa(String.fromCharCode(...byteArray));
};

const blowFishSimpleHash = (password, salt, cost) => {
  const rounds = Math.pow(2, cost);
  const nochange = salt + password;
  let result = salt + password;
  for (let i = 0; i < rounds; i++) {
    result = hashString(nochange + i.toString()).toString();
  }

  return btoa(result);
};

const generateSalt = (length = 12) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let salt = "";
  for (let i = 0; i < length; i++) {
    salt += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return salt;
};

const handleHash = (p, c = 10, l = 12) => {
  const salt = generateSalt(l);
  const hashPassword = blowFishSimpleHash(p, salt, c);
  const returnPassword =
    "$simple$" + c.toString() + "$" + btoa(salt) + "$" + hashPassword;
  return returnPassword;
};

const verifyPassword = (inputPassword, storedHash) => {
  if (!inputPassword || !storedHash) return false;

  const parts = storedHash.split("$");

  if (parts.length !== 5 || parts[1] !== "simple") {
    return false;
  }

  const cost = parseInt(parts[2]);
  const salt = atob(parts[3]);
  const expectedHash = parts[4];

  const inputHash = blowFishSimpleHash(inputPassword, salt, cost);
  return inputHash === expectedHash;
};

export { verifyPassword, handleHash };
