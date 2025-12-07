export default {
  routes: [
    {
      method: "POST",
      path: "/global/revalidate",
      handler: "api::global.revalidate.revalidate",
      config: {
        auth: {
          scope: ["admin"],
        },
        policies: [],
      },
    },
  ],
};
