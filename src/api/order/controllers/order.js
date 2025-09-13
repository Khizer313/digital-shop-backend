"use strict";
const stripe = require("stripe")(process.env.STRIPE_KEY);

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const { products } = ctx.request.body;

    try {
      if (!products || !Array.isArray(products)) {
        return ctx.badRequest("Products array is required.");
      }

      console.log("Incoming Products:", products);

      // ✅ Directly use frontend data
     const lineItems = await Promise.all(
  products.map(async (product) => {
    const item = await strapi.db.query("api::product.product").findOne({
      where: { id: product.id },
    });

    if (!item) {
      console.warn(`Product with ID ${product.id} not found`);
      return null;
    }

    const price = Number(item.price);
    const quantity = Number(product.quantity) || 1;

    if (isNaN(price)) {
      throw new Error(`Invalid price for product ${item.title}`);
    }

    return {
      price_data: {
        currency: "pkr",
        product_data: {
          name: item.title,
          images: item.img?.url ? [item.img.url] : [],
        },
        unit_amount: Math.round(price * 100),
      },
      quantity,
    };
  })
);


      if (!lineItems.length) {
        return ctx.badRequest("No valid products to checkout.");
      }

      // ✅ Create Stripe session
      const session = await stripe.checkout.sessions.create({
        shipping_address_collection: { allowed_countries: ["PK"] },
        payment_method_types: ["card"],
        mode: "payment",
     success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
cancel_url: `${process.env.CLIENT_URL}/cancel`,

        line_items: lineItems,
      });

      // ✅ Save order in DB
      await strapi.service("api::order.order").create({
        data: { products, stripeId: session.id },
      });

      return { stripeSession: session };
    } catch (error) {
      console.error("Order Create Error:", error);
      ctx.response.status = 500;
      return { error: error.message };
    }
  },
}));
