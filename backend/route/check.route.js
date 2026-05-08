import express from 'express'
const router = express.Router()
import { checkEmail, checkURL } from '../controller/check.controller.js'

router.post('/url', checkURL)
router.post('/email', checkEmail)

export default router
