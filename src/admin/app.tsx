import { StrapiApp } from "@strapi/strapi/admin";
import RevalidateButton from "./components/RevalidateButton";

export default {
  bootstrap(app: StrapiApp) {
    app.getPlugin("content-manager").injectComponent("ListView", "actions", {
      name: "RevalidateButton",
      Component: RevalidateButton,
    });
  },
};
