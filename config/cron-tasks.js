// config/cron-tasks.js
module.exports = {
  sendScheduledNotifications: {
    task: async ({ strapi }) => {
      const webpush = require('web-push');

      webpush.setVapidDetails(
        `mailto:${process.env.VAPID_EMAIL}`,
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
      );

      // 1) find unsent notifications
      const notifications = await strapi.entityService.findMany('api::notification.notification', {
        filters: { sent: false },
        // select fields if needed
      });

      if (!notifications || notifications.length === 0) return;

      // 2) get saved subscriptions
      const subs = await strapi.entityService.findMany('api::subscription.subscription', { limit: -1 });

      for (const n of notifications) {
        const created = new Date(n.createdAt).getTime();
        const delayMs = (n.mint || 1) * 60 * 1000;
        const scheduledAt = created + delayMs;

        if (Date.now() >= scheduledAt) {
          const payload = JSON.stringify({
            title: n.title,
            body: n.body || 'Check our latest update 🔔',
            url: n.url || '/'
          });

          for (const s of subs) {
            try {
              await webpush.sendNotification(s.payload, payload);
            } catch (err) {
              strapi.log.error('Push send error', err);
              // optionally remove invalid subscriptions here if error status 410
            }
          }

          // mark sent = true
          await strapi.entityService.update('api::notification.notification', n.id, {
            data: { sent: true },
          });
        }
      }
    },
    options: {
      rule: '* * * * *' // runs every minute
    }
  }
};
