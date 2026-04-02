import { Router } from 'express';
import {
    createAnnouncement,
    getAllAnnouncements,
    deleteAnnouncement
} from "../controller/announcement.controller.js"
import { verifyModerator } from '../middlewares/verifyModerator.js';
import { verifyJwt } from '../middlewares/verifyJwt.js';


const router = Router();

router.route('/create').post(verifyJwt, verifyModerator, createAnnouncement);
router.route('/all').get(verifyJwt, getAllAnnouncements);
router.route('/:id').delete(verifyJwt, verifyModerator, deleteAnnouncement);
export default router;