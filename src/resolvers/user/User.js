async function baskets(user) {
  const baskets = await user.getBaskets();

  if (baskets) {
    return baskets;
  } else {
    throw new Error("No baskets found for this user");
  }
}

async function gifts(user) {
  const gifts = await user.getGifts();

  if(gifts) {
    return gifts;
  } else {
    throw new Error("No gifts found for this user");
  }
}

module.exports = {
  baskets,
  gifts
};
