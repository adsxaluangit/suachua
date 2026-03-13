const config = {
  locales: [
    'vi',
  ],
  translations: {
    vi: {
      "Auth.form.welcome.title": "Chào mừng đến với Strapi!",
      "Auth.form.welcome.subtitle": "Đăng nhập vào tài khoản của bạn",
      "app.components.LeftMenu.navbrand.title": "Bảng điều khiển",
    },
  },
};

const bootstrap = (app) => {
  console.log('Strapi Admin Bootstrapped with Vietnamese locale');
};

export default {
  config,
  bootstrap,
};
