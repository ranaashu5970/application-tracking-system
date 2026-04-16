import express from 'express';
const router = express.Router();
import { addApplication, updateApplication } from '../controllers/Application/addApplication.js';
import { getApplications } from '../controllers/Application/getApplications.js';
import { getApplication } from '../controllers/Application/getApplication.js';

router.post('/post-application', addApplication);
router.put('/update-application', updateApplication);
router.get('/get-application/:id', getApplication);
router.get('/all-application/', getApplications);

export default router;