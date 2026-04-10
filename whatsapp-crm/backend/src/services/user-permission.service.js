import User from '#models/user.model.js'

export const assignRoles = async (userId, roles) =>
  User.findByIdAndUpdate(userId, { $addToSet: { roles: { $each: roles } } }, { new: true }).lean()

export const revokeRoles = async (userId, roles) =>
  User.findByIdAndUpdate(userId, { $pull: { roles: { $in: roles } } }, { new: true }).lean()

export const addExtraPermissions = async (userId, permissions) =>
  User.findByIdAndUpdate(userId, { $addToSet: { extraPermissions: { $each: permissions } } }, { new: true }).lean()

export const removeExtraPermissions = async (userId, permissions) =>
  User.findByIdAndUpdate(userId, { $pull: { extraPermissions: { $in: permissions } } }, { new: true }).lean()

export const addRevokedPermissions = async (userId, permissions) =>
  User.findByIdAndUpdate(userId, { $addToSet: { revokedPermissions: { $each: permissions } } }, { new: true }).lean()

export const removeRevokedPermissions = async (userId, permissions) =>
  User.findByIdAndUpdate(userId, { $pull: { revokedPermissions: { $in: permissions } } }, { new: true }).lean()
