async function users(gift) {
  const users = await gift.getUsers();

  if (users) {
    return users;
  } else {
    throw new Error("No users found for this gift.");
  }
}

async function baskets(gift) {
  const baskets =  gift.getBaskets();

  if(baskets) {
    return baskets;
  } else {
    throw new Error("No baskets found for this gift");
  }
}

module.exports = {
  users,
  baskets,
}
