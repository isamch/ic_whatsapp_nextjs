import { Router } from 'express'
import { validate } from '#middlewares/validate.middleware.js'
import { createCampaignSchema } from '#validations/campaign.validation/createCampaign.validation.js'
import { updateCampaignSchema } from '#validations/campaign.validation/updateCampaign.validation.js'
import {
  createCampaign, getCampaigns, getCampaignById,
  updateCampaign, deleteCampaign,
  runCampaignCtrl, pauseCampaignCtrl, resumeCampaignCtrl,
  stopCampaignCtrl, getCampaignLogs, resetCampaignCtrl,
} from '#controllers/campaign.controller.js'

const router = Router()

router.route('/').get(getCampaigns).post(validate(createCampaignSchema), createCampaign)
router.route('/:id').get(getCampaignById).patch(validate(updateCampaignSchema), updateCampaign).delete(deleteCampaign)
router.post('/:id/run', runCampaignCtrl)
router.post('/:id/pause', pauseCampaignCtrl)
router.post('/:id/resume', resumeCampaignCtrl)
router.post('/:id/stop', stopCampaignCtrl)
router.post('/:id/reset', resetCampaignCtrl)
router.get('/:id/logs', getCampaignLogs)

export default router
