const { Carts } = require("../models");

async function calculatePrice(cart_id) {
  const Cart = await Carts.findOne(
    { _id: cart_id, is_ordered: false },
    { kits: 1, price: 1, coupon: 1, actual_price: 1, discountInPercentage: 1 }
  ).populate({
    path: "kits",
    select: ["product"],
    model: "kitInstance",
    populate: {
      path: "product",
      select: "price",
      model: "healthkit",
    },
  });

  let price = 0;
  Cart.kits?.forEach((kit) => {
    price += kit.product.price;
  });

  Cart.actual_price = price;
  Cart.price = price - (price * (Cart.discountInPercentage || 0)) / 100;

  await Cart.save();

  return Cart;
}

module.exports = calculatePrice;
