'use strict';

module.exports = {
  register(/*{ strapi }*/) {},
  
  async bootstrap({ strapi }) {
    // 1. Give API access to Authenticated and Public Roles
    try {
      console.log('--- Strapi 5 Bootstrap: Setting Permissions ---');
      const roles = await strapi.query('plugin::users-permissions.role').findMany();
      
      const publicRole = roles.find(r => r.type === 'public');
      const authRole = roles.find(r => r.type === 'authenticated');
      
      const permissions = [
        // Building
        'api::building.building.find',
        'api::building.building.findOne',
        'api::building.building.create',
        'api::building.building.update',
        'api::building.building.delete',
        // Room
        'api::room.room.find',
        'api::room.room.findOne',
        'api::room.room.create',
        'api::room.room.update',
        'api::room.room.delete',
        // Department
        'api::department.department.find',
        'api::department.department.findOne',
        'api::department.department.create',
        'api::department.department.update',
        'api::department.department.delete',
        // Repair Request
        'api::repair-request.repair-request.find',
        'api::repair-request.repair-request.findOne',
        'api::repair-request.repair-request.create',
        'api::repair-request.repair-request.update',
        'api::repair-request.repair-request.delete',
        // Users & Permissions (Auth & Users)
        'plugin::users-permissions.auth.callback',
        'plugin::users-permissions.auth.register',
        'plugin::users-permissions.auth.emailConfirmation',
        'plugin::users-permissions.user.find',
        'plugin::users-permissions.user.findOne',
        'plugin::users-permissions.user.me',
        'plugin::users-permissions.user.create',
        'plugin::users-permissions.user.update',
        'plugin::users-permissions.user.destroy'
      ];

      for (const role of [publicRole, authRole].filter(Boolean)) {
        console.log(`Configuring role: ${role.type}`);
        for (const action of permissions) {
          const existing = await strapi.query('plugin::users-permissions.permission').findOne({
            where: { role: role.id, action }
          });
          if (!existing) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: { action, role: role.id }
            });
          }
        }
      }
      console.log('✅ All permissions verified.');
    } catch (err) {
      console.error('❌ Error during permission bootstrap:', err);
    }

    // 2. Cleanup and Seed Data
    try {
      console.log('--- Seeding Data ---');
      
      // Cleanup existing data to start fresh
      await strapi.query('api::building.building').deleteMany();
      await strapi.query('api::room.room').deleteMany();
      await strapi.query('api::department.department').deleteMany();

      // Seed Department
      const dept = await strapi.query('api::department.department').create({
        data: { name: 'Phòng Tổ chức - Hành chính', code: 'TCHC' }
      });
      console.log('✅ Department seeded:', dept.name);

      // Seed Building
      const bld = await strapi.query('api::building.building').create({
        data: { name: 'Nhà A', code: 'A', description: 'Tòa nhà văn phòng chính' }
      });
      console.log('✅ Building seeded:', bld.name);

      // Seed Room
      const room = await strapi.query('api::room.room').create({
        data: { roomNumber: 'A101', type: 'Văn phòng', floor: 1, building: bld.id }
      });
      console.log('✅ Room seeded: A101');

      // Cleanup existing users to avoid collisions
      const cleanupEmails = ['admin@suachua.vn', 'admin2@school.edu.vn', 'admin@school.edu.vn'];
      for (const email of cleanupEmails) {
        await strapi.query('plugin::users-permissions.user').delete({ where: { email } });
        await strapi.query('admin::user').delete({ where: { email } });
      }

      // Search for Authenticated Role
      const authRole = await strapi.query('plugin::users-permissions.role').findOne({ where: { type: 'authenticated' } });

      // A. Seed API User (for Frontend)
      const userEmail = 'admin@suachua.vn';
      const userPass = 'admin123';
      
      const apiUser = await strapi.plugin('users-permissions').service('user').add({
        username: 'admin',
        email: userEmail,
        password: userPass,
        confirmed: true,
        provider: 'local',
        role: authRole.id,
        user_role: 'ADMIN',
        department: dept.id
      });
      console.log(`✅ API User (up_user) seeded: ${apiUser.email} (ID: ${apiUser.id})`);

      // B. Seed Dashboard User (for /admin)
      try {
        const superAdminRole = await strapi.service('admin::role').getSuperAdmin();
        if (superAdminRole) {
           const dashboardUser = await strapi.service('admin::user').create({
             email: userEmail,
             firstname: 'Admin',
             lastname: 'User',
             password: userPass,
             registrationToken: null,
             isActive: true,
             roles: [superAdminRole.id],
           });
           console.log(`✅ Dashboard User (admin_user) seeded: ${dashboardUser.email} (ID: ${dashboardUser.id})`);
        }
      } catch (adminErr) {
        console.error('❌ Error seeding Dashboard User:', adminErr.message);
      }

    } catch (err) {
      console.error('❌ Error during data seeding:', err);
    }
  },
};
