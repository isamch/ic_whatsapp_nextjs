import { describe, it, expect, vi } from 'vitest'
import { fakeTemplate } from '../../helpers/factories.js'

vi.mock('#models/template.model.js', () => ({
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

import Template from '#models/template.model.js'
import * as TemplateService from '#services/template.service.js'

describe('TemplateService.create', () => {

  it('should create template successfully', async () => {
    Template.create.mockResolvedValue(fakeTemplate)

    const result = await TemplateService.create('userId123', { name: fakeTemplate.name, body: fakeTemplate.body })

    expect(Template.create).toHaveBeenCalledOnce()
    expect(result.name).toBe(fakeTemplate.name)
  })

})

describe('TemplateService.deleteById', () => {

  it('should throw error if template not found', async () => {
    Template.findOne.mockResolvedValue(null)

    await expect(
      TemplateService.deleteById('userId123', 'fakeId')
    ).rejects.toThrow()
  })

})
