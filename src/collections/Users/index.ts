import type { CollectionConfig } from 'payload'
import { admins, adminsOrSelf, adminsAdminAccess } from '@/access'

/**
 * Users Collection
 *
 * Authentication-enabled collection for managing users with roles.
 * Roles: admin, editor, user
 *
 * Admin access is restricted to users with the 'admin' role.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'User',
    plural: 'Users',
  },
  // Enable authentication
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role'],
    // Restrict admin panel access to admin role only
    hidden: ({ user }) => {
      return user?.role !== 'admin'
    },
  },
  access: {
    // Admins can read all users, others can only read their own user
    read: adminsOrSelf,
    // Only admins can create users (except via registration if enabled)
    create: admins,
    // Admins can update any user, others can only update themselves
    update: adminsOrSelf,
    // Only admins can delete users
    delete: admins,
    // Admin panel access restricted to admin role
    admin: adminsAdminAccess,
  },
  fields: [
    // Email is automatically included by auth: true
    // Password is automatically included by auth: true
    {
      name: 'name',
      type: 'text',
      label: 'Name',
    },
    {
      name: 'role',
      type: 'select',
      label: 'Role',
      required: true,
      defaultValue: 'user',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'User', value: 'user' },
      ],
      access: {
        // Only admins can update the role field
        update: adminsAdminAccess,
      },
    },
  ],
}

export default Users
