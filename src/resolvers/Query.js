async function currentUser(root, args, { currentUser, models }) {
  const user =  await models.user.findOne({
    where: {
      id: currentUser.userId
    }
  });

  if (user) {
    return user;
  } else {
    throw new Error("User not found");
  }
}

async function basket(root, { id }, { models }) {
  const basket = await models.basket.findOne({
    where: {
      id: id
    }
  });

  if (basket) {
    return basket
  } else {
    throw new Error("Basket not found");
  }
}

async function gifts(root, args, { currentUser, models }) {
  const gifts = await models.gift.findAll({
    include: models.user
  });

  let filteredGifts = [];
  filteredGifts = gifts.filter(item => {
    const userIds = item.users.map(user => {
      return user.id;
    });
    return !userIds.includes(currentUser.userId) && item.isPublic;
  });

  if (filteredGifts) {
    return filteredGifts;
  } else {
    throw new Error("Gifts not found");
  }
}

module.exports = {
  currentUser,
  basket,
  gifts
};
