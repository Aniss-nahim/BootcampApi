/**
 * Paginater engine middleware
 */
const asyncHundler = require("./async");
const ErrorApi = require("../error/ErrorApi");

const paginate = asyncHundler(async (req, res, next) => {
  // Get data passed
  let { query, total } = res.locals;

  //Pagination
  const limit = Math.abs(parseInt(req.query.limit, 10)) || 25;
  const page = Math.abs(parseInt(req.query.page, 10)) || 1;
  const start = (page - 1) * limit;
  const end = page * limit;
  const last_page = Math.ceil(total / limit);

  if (page > last_page) {
    return next(ErrorApi.NotFound());
  }

  query = query.skip(start).limit(limit);

  // Execute query
  const data = await query;

  // Set urls
  const urlObj = new URL(
    `${req.protocol}://${req.get("host")}${req.originalUrl}`
  );
  urlObj.searchParams.delete("limit");
  urlObj.searchParams.delete("page");

  // Pagination Object
  const pagination = {
    per_page: limit,
    current_page: page,
    last_page,
    first_page_url: `${urlObj.href}&page=1&limit=${limit}`,
    last_page_url: `${urlObj.href}&page=${last_page}&limit=${limit}`,
    path: urlObj.origin,
    from: start + 1,
    to: start + data.length,
  };

  // has next page
  if (end < total) {
    pagination.next_page_url = `${urlObj.href}&page=${page + 1}&limit=${limit}`;
  }

  // has previous page
  if (start > 0) {
    pagination.prev_page_url = `${urlObj.href}&page=${page - 1}&limit=${limit}`;
  }

  return res
    .status(200)
    .json({ success: true, count: total, pagination, data });
});

module.exports = paginate;
