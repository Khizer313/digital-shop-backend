module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),

  // 👇 sabse important
  url: env('PUBLIC_URL', 'https://digital-shop-backend-production.up.railway.app'),

  proxy: true, // ✅ yeh line add karo (double URL ka masla ye fix karega)

  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
