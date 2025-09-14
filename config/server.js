module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),   // sab interfaces pe suno
  port: env.int('PORT', 1337),    // default Strapi port
  url: env('PUBLIC_URL', 'https://digital-shop-backend-production.up.railway.app'), // ✅ local backend URL
  app: {
    keys: env.array('APP_KEYS', ['key1', 'key2']), // agar .env me nahi h to fallback
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
