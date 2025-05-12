import Role from '../models/Role';
import { Snowflake } from '@theinternetfolks/snowflake';

const defaultRoles = [
  {
    id: Snowflake.generate(),
    name: 'Community Admin'
  },
  {
    id: Snowflake.generate(),
    name: 'Community Moderator'
  },
  {
    id: Snowflake.generate(),
    name: 'Community Member'
  }
];

export const seedRoles = async () => {
  try {
    // Check if roles already exist
    const existingRoles = await Role.find();
    
    if (existingRoles.length === 0) {
      // Create default roles
      await Role.insertMany(defaultRoles);
      console.log('Default roles seeded successfully');
    } else {
      console.log('Roles already exist, skipping seeding');
    }
  } catch (error) {
    console.error('Error seeding roles:', error);
    process.exit(1);
  }
}; 