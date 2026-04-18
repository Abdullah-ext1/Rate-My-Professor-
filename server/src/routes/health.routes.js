import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    ok: true,
    status: 'UP',
    service: 'rateprofessor-server',
    timestamp: new Date().toISOString()
  });
});

export default router;