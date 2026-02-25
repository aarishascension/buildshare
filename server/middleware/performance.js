import compression from 'compression';

// Gzip compression
export const compressResponses = compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6
});

// Response time logger
export const responseTimeLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 1000) {
      console.warn(`Slow request: ${req.method} ${req.path} took ${duration}ms`);
    }
  });
  
  next();
};

// Cache control headers
export const cacheControl = (duration = 3600) => {
  return (req, res, next) => {
    res.set('Cache-Control', `public, max-age=${duration}`);
    next();
  };
};

// Pagination helper
export const paginate = (query, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
};

// Database query optimization
export const optimizeQuery = (model) => {
  return {
    // Lean queries for read-only operations
    lean: () => model.lean(),
    
    // Select only needed fields
    selectFields: (fields) => model.select(fields),
    
    // Populate with field selection
    populateOptimized: (path, select) => model.populate(path, select),
  };
};
