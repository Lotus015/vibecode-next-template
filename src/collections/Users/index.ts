import type { CollectionConfig } from 'payload'

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
    // Only admins can read the users list
    read: ({ req: { user } }) => {
      if (!user) return false
      // Admins can read all users
      if (user.role === 'admin') return true
      // Others can only read their own user
      return {
        id: {
          equals: user.id,
        },
      }
    },
    // Only admins can create users (except via registration if enabled)
    create: ({ req: { user } }) => {
      return user?.role === 'admin'
    },
    // Admins can update any user, others can only update themselves
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return {
        id: {
          equals: user.id,
        },
      }
    },
    // Only admins can delete users
    delete: ({ req: { user } }) => {
      return user?.role === 'admin'
    },
    // Admin panel access restricted to admin role
    admin: ({ req: { user } }) => {
      return user?.role === 'admin'
    },
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
        update: ({ req: { user } }) => {
          return user?.role === 'admin'
        },
      },
    },
  ],
}

export default Users
