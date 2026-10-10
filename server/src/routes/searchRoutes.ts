import { Router } from 'express';
import { globalSearch, getSearchSuggestions, searchYouTubeVideos, getSearchKnowledge } from '../controllers/searchController';

const router = Router();

router.get('/', globalSearch);
router.get('/youtube', searchYouTubeVideos);
router.get('/knowledge', getSearchKnowledge);
router.get('/suggestions', getSearchSuggestions);

export default router;
