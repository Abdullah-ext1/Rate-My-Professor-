import { Router } from 'express';
import {
    createAnnouncement,
    getAllAnnouncements,
    deleteAnnouncement
} from '../controllers/announcement.controller.js';
import verifyModerator from '../middlewares/verifyModerator.js';
import verifyjwt from '../middlewares/verifyJwt.js';


const router = Router();

router.route('/create').post(verifyjwt, verifyModerator, createAnnouncement);
router.route('/all').get(verifyjwt, getAllAnnouncements);
router.route('/:id').delete(verifyjwt, verifyModerator, deleteAnnouncement);
export default router;