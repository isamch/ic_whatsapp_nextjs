import { describe, it, expect, vi } from 'vitest'
import { fakeContact } from '../../helpers/factories.js'

vi.mock('#models/contact.model.js', () => ({
  default: {
    findOne: vi.fn(),
    find: vi.fn(),
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
    create: vi.fn(),
    countDocuments: vi.fn(),
  },
}))

vi.mock('#models/contact-list.model.js', () => ({
  default: {
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
  },
}))

import Contact from '#models/contact.model.js'
import * as ContactService from '#services/contact.service.js'

describe('ContactService.create', () => {

  it('should throw error if phone already exists in list', async () => {
    Contact.findOne.mockResolvedValue(fakeContact)

    await expect(
      ContactService.create(
        'userId123',
        { name: 'Test', phone: fakeContact.phone, listId: fakeContact.listId }
      )
    ).rejects.toThrow()
  })

})

describe('ContactService.deleteById', () => {

  it('should throw error if contact not found', async () => {
    Contact.findOne.mockResolvedValue(null)

    await expect(
      ContactService.deleteById('userId123', 'fakeId')
    ).rejects.toThrow()
  })

})
