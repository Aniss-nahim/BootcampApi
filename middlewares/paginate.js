/**
 * Paginater engine middleware
 */
const asyncHundler = require('./async');

const paginate = asyncHundler((req, res, next) => {
    const {page, limit, total, data} = req.paginate;
    const start = (page - 1) * limit;
    const end = page*limit;
    const last_page = Math.ceil(total/limit);

    // Set urls
    const urlObj  = new URL(`${req.protocol}://${req.get('host')}${ req.originalUrl}`);
    urlObj.searchParams.delete('limit');
    urlObj.searchParams.delete('page');

    // Pagination Object
    const pagination = {
        per_page : limit,
        current_page : page,
        last_page,
        first_page_url : `${urlObj.href}&page=1&limit=${limit}`,
        last_page_url : `${urlObj.href}&page=${last_page}&limit=${limit}`,
        path : urlObj.origin,
        from : start + 1,
        to :  start + data.length 
    };

    // has next page
    if(end < total){
        pagination.next_page_url = `${urlObj.href}&page=${page+1}&limit=${limit}`;
    }

    // has previous page
    if(start > 0){
        pagination.prev_page_url = `${urlObj.href}&page=${page-1}&limit=${limit}`;
    }

    return res.status(200)
    .json({ success : true, count : total, pagination, data});
});

module.exports = paginate;