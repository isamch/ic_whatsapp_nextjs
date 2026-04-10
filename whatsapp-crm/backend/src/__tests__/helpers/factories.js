export const fakeUser = {
  _id: '64a1b2c3d4e5f6a7b8c9d0e1',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedPassword123',
  roles: ['user'],
  isActive: true,
  refreshToken: null,
}

export const fakeAdmin = {
  _id: '64a1b2c3d4e5f6a7b8c9d0e2',
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'hashedPassword123',
  roles: ['admin'],
  isActive: true,
  refreshToken: null,
}

export const fakeCampaign = {
  _id: '64a1b2c3d4e5f6a7b8c9d0e3',
  name: 'Test Campaign',
  status: 'draft',
  templateId: '64a1b2c3d4e5f6a7b8c9d0e4',
  listId: '64a1b2c3d4e5f6a7b8c9d0e5',
  ratePerMinute: 10,
  sent: 0,
  failed: 0,
  total: 0,
}

export const fakeTemplate = {
  _id: '64a1b2c3d4e5f6a7b8c9d0e4',
  name: 'Test Template',
  body: 'Hello {{name}}, welcome!',
  variables: ['name'],
}

export const fakeContact = {
  _id: '64a1b2c3d4e5f6a7b8c9d0e6',
  name: 'John Doe',
  phone: '+212612345678',
  listId: '64a1b2c3d4e5f6a7b8c9d0e5',
  validationStatus: 'unknown',
}
