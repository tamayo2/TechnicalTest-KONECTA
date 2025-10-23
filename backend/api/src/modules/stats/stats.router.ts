import { Router } from 'express';
import { summary } from './stats.controller';
import { requireAuth } from '../../middleware/auth';

const r = Router();
r.use(requireAuth);
r.get('/summary', summary);
export default r;