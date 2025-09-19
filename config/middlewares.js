module.exports = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", "https:"],
          'img-src': ["'self'", "data:", "blob:", "https://res.cloudinary.com"],
          'media-src': ["'self'", "data:", "blob:", "https://res.cloudinary.com"],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'https://storeon.vercel.app', // ✅ frontend domain
        'http://localhost:3000',      // ✅ local dev
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      headers: '*',
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',

  // ✅ Add this block for upload
  {
    name: 'strapi::upload',
    config: {
      breakpoints: {
        large: 1000,
        medium: 750,
        small: 500,
        thumbnail: 64,
      },
      mimeTypes: [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/avif', // keep avif also
      ],
    },
  },
];
