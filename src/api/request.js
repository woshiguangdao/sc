// Minimal request wrapper that re-exports the existing request helper
// This file delegates to src/utils/request.js to avoid duplicating axios setup
import request from '../utils/request';

export default request;

