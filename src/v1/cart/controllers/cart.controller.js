const { Carts, Kits, Coupons } = require("../models");
const Products = require("../../products/models");

const BadRequestError = require("../../../errors/bad-request");
const calculatePrice = require("../functions/calculate-price");
const { cartValidator, assignKitValidator } = require("../validators");

/**
 * Create a cart
 * @param product_id an active product id
 *
 * @method POST
 * @api /cart/create
 * @access client
 */
exports.createCart = async (req, res) => {
  // validate input
  const { error, value } = cartValidator(req.body);
  if (error) throw new BadRequestError(error.message);
  // check if product is active
  const product = await Products.findOne({
    _id: value.product_id,
    is_active: true,
  });
  if (!product) throw new BadRequestError("Invalid Product");

  // calculate price
  const price = product.price; // calculatePrice(req.body.discountCoupon, product.price, req.body.products);

  // creating a kit object
  const kit = await Kits.create({ product: product.id });

  let cart = null;

  // check if cart exists
  const activeCart = await Carts.findOne({
    user: req.user.id,
    is_ordered: false,
  });
  if (!activeCart) {
    // create a new cart
    const newCart = await Carts.create({
      user: req.user.id,
      price: price,
      kits: [kit],
    });
    cart = newCart;
  } else {
    cart = activeCart;
    cart.kits.push(kit);
    // cart.price += price;
    await cart.save();
    await calculatePrice(cart._id);
  }

  // TODO: THIS NEEDS TO BE REPLACED IN NEXT PHASE
  const activeCart1 = await Carts.findOne({
    user: req.user.id,
    is_ordered: false,
  });

  return res.status(201).json({
    status: "success",
    message: "Item added to cart",
    cart: activeCart1,
  });
};

/**
 * Fetch a cart
 * @method GET
 * @api /cart
 * @access client
 */
exports.getCart = async (req, res) => {
  const activeCart = await Carts.findOne({
    user: req.user.id,
    is_ordered: false,
  });

  if (!activeCart) throw new BadRequestError("No active cart found!");

  let kits = [];
  for (const kitId of activeCart.kits) {
    const kit = await Kits.findById(kitId, {
      // product: 0,
      is_active: 0,
    }).populate([
      {
        path: "patient_id",
        select: { firstname: 1, lastname: 1, age: 1, gender: 1 },
      },
      {
        path: "product",
        select: { name: 1 },
      },
    ]);
    kits.push(kit);
  }

  await calculatePrice(activeCart._id);

  return res.json({
    status: "success",
    message: "Cart fetched successfully",
    cart: activeCart,
    kits,
  });
};

/**
 * Assigning a kit with patient details
 * Required firstname, lastname, age, gender, _id: Kit ID
 * @param {[Object]} patients array of patients
 * @method POST
 * @api /cart/assign
 * @access client
 */
exports.assignKit = async (req, res) => {
  // validate input
  const { error, value } = assignKitValidator(req.body.patients);
  if (error) throw new BadRequestError(error.message);

  // check if cart exists
  const activeCart = await Carts.findOne({
    user: req.user.id,
    is_ordered: false,
  });
  if (!activeCart) throw new BadRequestError("No active cart found!");

  if (req.body.patients.length !== activeCart.kits.length)
    throw new BadRequestError("Every kits should have patient details!");

  // assigning
  let kits = [];



  for (const patient in req.body.patients) {
    if (activeCart.kits.includes(req.body.patients[patient]._id)) {
      const kit = await Kits.findById(req.body.patients[patient]._id);
    
      // kit.firstname = req.body.patients[patient].firstname;
      // kit.lastname = req.body.patients[patient].lastname;
      // kit.age = req.body.patients[patient].age;
      // kit.gender = req.body.patients[patient].gender;
      
      kit.patient_id = req.body.patients[patient].patient_id;
      kit.is_active = 1;
      kit.save();
      kits.push(kit);
      console.log('kit',kit)
    } else {
      throw new BadRequestError(
        `Invalid Kit ID: ${req.body.patients[patient]._id}`
      );
    }
  }
  return res.json({
    status: "success",
    message: "Assigned patient(s) with kit(s)",
    cart: activeCart,
    kits,
  });
  
};

/**
 * Removing kit from active cart
 * @param kitId a kitId which is in this users cart
 * @method DELETE
 * @api /cart/remove-kit
 * @access client
 */
exports.removeKit = async (req, res) => {
  // check if cart exists
  const activeCart = await Carts.findOne(
    {
      user: req.user.id,
      kits: req.body.kitId,
      is_ordered: false,
    },
    { kits: 1, price: 1 }
  );
  if (!activeCart) throw new BadRequestError("No active cart found!");

  // removing from active cart
  const poppedKit = activeCart.kits.pop();
  await activeCart.save();

  // removing kit instance
  await Kits.findOneAndRemove({ _id: poppedKit });

  await calculatePrice(activeCart._id);

  // TODO: THIS NEEDS TO BE REPLACED IN NEXT PHASE
  const activeCart1 = await Carts.findOne(
    {
      user: req.user.id,
      is_ordered: false,
    },
    { kits: 1, price: 1, actual_price: 1, discountInPercentage: 1 }
  );

  return res.json({
    status: "success",
    message: "Removed",
    activeCart: activeCart1,
  });
};

/**
 * Apply promo code in active cart
 * @method POST
 * @api /cart/apply-coupon
 * @access client
 */
exports.applyCoupon = async (req, res) => {
  // check if cart exists
  const activeCart = await Carts.findOne(
    {
      user: req.user.id,
      is_ordered: false,
    },
    { coupon: 1, discountInPercentage: 1 }
  );
  if (!activeCart) throw new BadRequestError("Please add a kit into cart.");

  const applicableCoupon = await Coupons.findOne({
    code: req.body.coupon,
    is_active: true,
  });
  if (!applicableCoupon) throw new BadRequestError("Invalid coupon code");

  activeCart.coupon = applicableCoupon.code;
  activeCart.discountInPercentage = applicableCoupon.discountInPercentage;
  await activeCart.save();

  await calculatePrice(activeCart._id);

  return res.json({
    status: "success",
    message: `Coupon Applied! You are eligible for ${applicableCoupon.discountInPercentage}% discount.`,
    activeCart,
    applicableCoupon,
  });
};

exports.createCoupon = async (req, res) => {
  const coupon = await Coupons.create(req.body);
  return res.status(201).json({
    status: "success",
    coupon,
  });
};
