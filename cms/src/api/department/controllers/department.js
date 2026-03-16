const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::department.department', ({ strapi }) => ({
  async find(ctx) {
    const { data, meta } = await super.find(ctx);
    const enrichedData = data.map(item => ({
      ...item,
      strapiId: item.id, // In Strapi 5, item.id in core controller is often the numeric ID
    }));
    return { data: enrichedData, meta };
  },
  async findOne(ctx) {
    const response = await super.findOne(ctx);
    if (response && response.data) {
        response.data.strapiId = response.data.id;
    }
    return response;
  }
}));
