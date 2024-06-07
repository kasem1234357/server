const { responce_status } = require("../constraints/RESPONCE_STATUS");
const CustomError = require("./Error");
class API {
  constructor(request, responce, query = null ,queryParams=[]) {
    this.req = request;
     this.res = responce;
      this.query = query;
      this.queryParams = queryParams;
  }
  /**
   * Description
   * @returns {any}
   */
  getParams() {
    return this.req.params;
  }
  /**
   * Description
   * @returns {any}
   */
  getQuery() {
    const excludeFields = ["sort", "limit", "page", "fields"];
    let query = this.req.query;
    let queryObject = { ...query };
    const otherQuery = {};
    excludeFields.forEach((el) => {
      otherQuery[el] = queryObject[el];
      delete queryObject[el];
    });
    let filteringQuery = JSON.stringify(queryObject);
    filteringQuery = filteringQuery.replace(
      /\b(gte|lte|lt|gt)\b/g,
      (match) => `$${match}`
    );
    return {
      allQuery: query,
      otherQuery,
      filteringQuery,
    };
  }

  /**
   * Description
   *@param {keyof responce_status} type='default'
   * @param {any} data=null
   * @param {String} customMsg=''
   * @param {number} status=null
   * @returns {any}
   */
  dataHandler(type = "default", data = null, customMsg = "", status = null) {
    let improvedData = {};
    if (data) {
      improvedData = {
        status: "success",
        length: data.length,
        data: {
          ...data,
        },
        msg: responce_status[type].msg,
        customMsg,
      };
    } else {
      improvedData = {
        status: "successed",
        msg: responce_status[type].msg,
        customMsg,
      };
    }

    this.res.status(status || responce_status[type].status).json(improvedData);
  }
  /**
   * Description
   *@param {keyof responce_status} type ='server_error
   * @param {string} message=null
   * @param {number} customStatus=null
   * @returns {any}
   */
  errorHandler(type = "server_error", message = null, customStatus = null) {
    const customError = new CustomError(
      message || responce_status[type].msg,
      customStatus || responce_status[type].status
    );
    return customError;
  }
  /**
   * Description
   * @param {import("express").Request} query
   * @returns {any}
   */
  modify(query,queryParams) {
    this.query = query;
    this.queryParams = queryParams
    return this
  }
  sort() {
    const sortQuery = this.getQuery().otherQuery.sort;
    if (this.getQuery().otherQuery.sort) {
      const sortBy = sortQuery.split(",").join(" ");

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
  filter() {
    const queryFilter = JSON.parse(this.getQuery().filteringQuery)
    this.query = this.query.find(queryFilter);
    return this;
  }
  limitFields() {
    const fieldQuery = this.getQuery().otherQuery.fields;
    if (fieldQuery) {
      const fields = fieldQuery.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
  paginate() {
    const page = this.getQuery().otherQuery.page * 1 || 1;
    const limit = this.getQuery().otherQuery.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = API;
/*
sort {
  1- accept string ('n1 n2 m3' )
  2-   - for desc     +for asc  
  3- sort({
    name:'asc',
    age:'desc'
  })
}


skip
limit
select



*/
