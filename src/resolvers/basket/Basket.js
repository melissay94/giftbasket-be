async function user(basket) {
  const users = await basket.getUser();

  if (users) {
    return users;
  } else {
    throw new Error("No users found for this basket");
  }
}

async function gifts(basket) {
  const gifts = await basket.getGifts();

  console.log(gifts);

  if (gifts) {
    return gifts;
  } else {
    throw new Error("No gifts found for this basket");
  }
}

module.exports = {
  user,
  gifts,
}
