/**
 * Add sort to the query builder and passes
 * the new query to the next middleware
 *
 * ?sort=-name
 */
const sortResults = (req, res, next) => {
  let { query } = res.locals;
  // sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  res.locals = { query };
  next();
};

module.exports = sortResults;
