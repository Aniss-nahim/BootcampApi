/**
 * Build Advance Query and passes
 * the query to the next middleware
 *
 * ?select=name,description,carrier
 */
const AdvanceQuery = (Model) => (req, res, next) => {
  // copy req.query
  const reqQuery = { ...req.query };

  // Ignored fields
  const ignoredFields = ["select", "sort", "page", "limit", "paginate"];

  // delete the exculded fields from the reqQuery
  ignoredFields.forEach((field) => delete reqQuery[field]);

  // create String query
  let queryString = JSON.stringify(reqQuery);
  queryString = queryString.replace(/\b(g|l)te?|in\b/g, (match) => `$${match}`);
  let query = Model.find(JSON.parse(queryString));

  // select fields
  if (req.query.select) {
    // get formated string
    const fields = req.query.select.split(",").join(" ");
    query.select(fields);
  }

  res.locals = { query };
  next();
};

module.exports = AdvanceQuery;
