const jwt = require("jsonwebtoken");
require("dotenv").config();

// TODO: Figure out how to reset expiring tokens some day
function setToken(userId) {
  const expiration = 60 * 60 * 24 * 7; // Expires in a week
  const token = jwt.sign({ userId }, process.env.APP_SECRET, { expiresIn: `${expiration}s` });

  const expirationDate = new Date();
  expirationDate.setSeconds(expirationDate.getSeconds() + expiration);

  return {
    expires: expirationDate,
    token,
  };
}

async function signup(root, { email, password, name }, { currentUser, models }) {
  const [user, created] = await models.user.findOrCreate({
    where: {
      email: email
    },
    defaults: {
      email,
      password,
      name
    }
  });

  if (!created) {
    throw new Error('User already exists');
  }

  if (!user) {
    throw new Error('Unable to create new user');
  }

  const tokenInfo = setToken(user.id);

  return {
    user,
    ...tokenInfo,
  };
}

async function login(root, { email, password }, { currentUser, models }) {
  
  const user = await models.user.findOne({
    where: {
      email: email
    }
  });

  if (!user) {
    throw new Error("Could not find an account for that email");
  }

  if (!user.validPassword(password)) {
    throw new Error("Password is incorrect");
  }

  const tokenInfo = setToken(user.id);

  return {
    user,
    ...tokenInfo,
  };
}

async function updateUser(root, { email, name }, { currentUser, models }) {
  
  const user = await models.user.findOne({
    where: {
      id: currentUser.userId
    }
  });

  if (!user) {
    throw new Error(`Cannot access user at this time`);
  }

  const updatedUser = await user.update({
    name: name || user.name,
    email: email || user.email,
  });

  if (!updatedUser) {
    throw new Error(`${user.email} account could not be updated`);
  }

  const tokenInfo = setToken(user.id);

  return {
    user,
    ...tokenInfo,
  };
}

async function updatePassword(root, { password, newPassword }, { currentUser, models }) {
  
  const user = await models.user.findOne({
    where: {
      id: currentUser.userId
    }
  });

  if (!user) {
    throw new Error('Could not access user at this time');
  }

  if (!user.validPassword(password)) {
    throw new Error('Invalid password entered');
  }

  const updatedPassword = await user.update({
    password: newPassword,
  });

  if (!updatedPassword) {
    throw new Error(`${user.email}'s password could not be updated`);
  }

  const tokenInfo = setToken(user.id);

  return {
    user,
    ...tokenInfo,
  };
}

async function deleteUser(root, { password }, { currentUser, models }) {

  const user = await models.user.findOne({
    where: {
      id: currentUser.userId,
    }
  });

  if (!user) {
    throw new Error('Could not access user at this time');
  }

  if (!user.validPassword(password)) {
    throw new Error('Invalid password entered');
  }

  const userDeleted = await models.user.destroy({
    where: {
      id: user.id,
    }
  });

  return userDeleted > 0;
}

module.exports = {
  signup,
  login,
  updateUser,
  updatePassword,
  deleteUser,
};
