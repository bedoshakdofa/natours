class APIFeatures {
  constructor(query, querystring) {
    this.query = query;
    this.querystring = querystring;
  }

  filter() {
    const queryobj = { ...this.querystring };
    const excludefield = ['sort', 'limit', 'fields', 'page'];
    excludefield.forEach((ele) => delete queryobj[ele]);
    let querySTR = JSON.stringify(queryobj);
    querySTR = querySTR.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(querySTR));
    return this;
  }

  sort() {
    if (this.querystring.sort) {
      const sortby = this.querystring.sort.split(',').join(' ');
      this.query = this.query.sort(sortby);
    }
    return this;
  }
  paginate() {
    const limit = this.querystring.limit * 1 || 100;
    const page = this.querystring.page * 1 || 1;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
  limitFields() {
    if (this.querystring.fields) {
      const field = this.querystring.fields.split(',').join(' ');
      this.query = this.query.select(field);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
}
module.exports = APIFeatures;
