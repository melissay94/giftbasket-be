async function createBasket(root, { name, birthdate, address, gifts, existingGiftIds }, { currentUser, models }) {
  const basket = await models.basket.create({
    name,
    birthdate,
    address,
    userId: currentUser.userId
  });

  const currentUserObj = await models.user.findOne({
    where: {
      id: currentUser.userId
    }
  });

  // Need to make this so that we don't have to require gifts to create a new basket
  if (basket) {
    const createdGifts =await Promise.all(
      gifts.map(giftPayload => {
        return createGift(root, {
          title: giftPayload.title,
          description: giftPayload.description || "",
          link: giftPayload.link || null,
          image: giftPayload.image || null,
          isPublic: giftPayload.isPublic
        }, {
          currentUser,
          models
        });
    }));

    const newGiftIds = createdGifts.map(gift => {
      return gift.id;
    });

    await Promise.all(newGiftIds.map(giftId => {
      return Promise.all([
        basket.addGift(giftId),
        currentUserObj.addGift(giftId)
      ]);
    }));

    await Promise.all(existingGiftIds.map(giftId => {
      return basket.addGift(giftId);
    }));

    return basket;
  }

  throw new Error("Could not create basket");
}

async function editBasket(root, { id, name, birthdate, address }, { currentUser, models }) {
 const basket = await models.basket.findOne({
   where: {
     id
   }
 });

 if (basket && basket.userId === currentUser.userId) {
   const updatedBasket = await basket.update({
     name: name || basket.name,
     birthdate: birthdate || basket.birthdate,
     address: address || basket.address
   });

   if (updatedBasket) {
     return updatedBasket;
   } else {
     throw new Error(`Unable to update basket ${basket.name}`);
   }
 } else {
   throw new Error("Unable to find basket");
 }
}

async function deleteBasket(root, { id }, { currentUser, models }) {
    const basket = await models.basket.findOne({
      where: {
        id
      }
    });

    const user = await models.user.findOne({
      where: {
        id: currentUser.userId
      }
    });

    const gifts = await basket.getGifts();

    if (basket.userId === user.id) {

      await basket.removeGifts(gifts);

      const numDeleted = await models.basket.destroy({
        where: {
          id
        }
      });

      return numDeleted > 0;
    };
}

module.exports = {
  createBasket,
  editBasket,
  deleteBasket,
};
