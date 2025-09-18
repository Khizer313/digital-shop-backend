module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
      },
      actionOptions: {
        upload: {
          resource_type: "image",  // ✅ safe option
        },
        delete: {},
      },
      // ❌ Pehle tum breakpoints: {} kar rahe the (jo null object error deta hai)
      // ✅ Ye use karo:
      breakpoints: null,
    },
  },
});
