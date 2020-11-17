

async function createGift(root, { basketId, title, description, link, image, isPublic }, { currentUser, models }) {
  
  const gift = await models.gift.create({
    title,
    description, 
    link, 
    image,
    isPublic
  });

  const user = await models.user.findOne({
    where: {
      id: currentUser.userId
    }
  });

  if (gift) {
    if (user) {
      user.addGift(gift);
    }
    if (basketId) {
      const basket = await models.basket.findOne({
        where: {
          id: basketId
        }
      });
      if (basket) {
        console.log(basket);
        basket.addGift(gift);
      }
    }
    return gift;
  } else {
    throw new Error("Gift could not be created");
  }
}

async function editGift(root, { id, title, description, link, image, isPublic}, { currentUser, models }) {
  const gift = await models.gift.findOne({
    where: {
      id
    }
  });
  
  if (gift && !gift.isPublic) {
    const updatedGift = await gift.update({
      title: title || gift.title,
      description: description || gift.description,
      link: link || gift.link,
      image: image || gift.image,
      isPublic: isPublic || gift.isPublic
    });
    
    if (updatedGift) {
      return updatedGift;
    } else {
      throw new Error(`Cannot update gift ${gift.title}`)
    }

  } else {
    throw new Error("Cannot edit gift");
  }
}

async function deleteGift(root, { id }, { currentUser, models }) {
 const gift = await models.gift.findOne({
   where: {
     id
   }
 });

 const users = await gift.getUsers();
 const baskets = await gift.getBaskets();

 if (users.length > 1) {
   const currentUserBaskets = baskets.filter(basket => {
     return basket.userId === currentUser.userId;
   });

   await gift.removeBaskets(currentUserBaskets);

   const user = await models.user.findOne({
     where: {
       id: currentUser.userId
     }
   });

   await user.removeGifts(gift);

   return true;

 } else {
  await gift.removeUsers(users);
  await gift.removeBaskets(baskets);

  const numDeleted = await models.gift.destroy({
    where: {
      id 
    }
  });

  return numDeleted > 0;
 }
}

async function removeGiftFromBasket(root, { basketId, giftId }, { currentUser, models }) {

  const basket = await models.basket.findOne({
    where: { id: basketId }
  });

  const gift = await models.gift.findOne({
    where: { id: giftId }
  });

  if (basket && gift) {
    return await basket.removeGifts(gift);
  }
  
}

async function addGiftToUser(root, { id }, { currentUser, models }) {
  /*
    1. Find gift by id
    2. Check if your user already has this gift id
    3. If not, then add this gift id to user, and add user to gift id
    4. Return boolean for if added or not
   */
  const gift = await models.gift.findOne({
    where: { id }
  });

  const user = await models.user.findOne({
    where: { id: currentUser.userId },
    include: models.gift
  });

  if (user) {
    const giftIds = user.gifts.map(gift => {
      return gift.id;
    });

    if (gift) {
      if (giftIds.includes(gift.id)) {
        throw new Error("Gift already added to user");
      } else {
        await gift.addUsers(user);
        return user;
      }
    } else {
      throw new Error("Gift could not be found");
    }
  } else {
    throw new Error("User could not be found");
  }
}

async function addGiftToBasket(root, { basketId, giftId }, { currentUser, models }) {

  const gift = await models.gift.findOne({
    where: { id: giftId }
  });

  const basket = await models.basket.findOne({
    where: { id: basketId },
    include: models.gift
  });

  if (basket) {
    const giftIds = basket.gifts.map(gift => {
      return gift.id;
    });

    if (gift) {
      if (giftIds.includes(gift.id)) {
        throw new Error("Gift already in basket");
      } else {
        await gift.addBaskets(basket);
        return basket;
      } 
    } else {
      throw new Error("Gift could not be found");
    }
  } else {
    throw new Error("Basket could not be found");
  }
}

module.exports = {
  createGift,
  editGift,
  deleteGift,
  removeGiftFromBasket,
  addGiftToUser,
  addGiftToBasket,
};
