class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    //   Removing some fields for category
    const removeFields = ["page", "sort", "limit", "fields", "keyword"];

    removeFields.forEach((key) => delete queryCopy[key]);

    // Filter For Price and Rating
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    // console.log(JSON.parse(queryStr));

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }
  sort() {
    // Sorting
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort?.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    // Fields Limiting
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }
  paginate() {
    //Pagination
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || process.env.RPP || 8;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit).sort();

    return this;
  }

  search() {
    if (this.queryStr.keyword) {
      const keyword = this.queryStr.keyword
        ? {
            name: {
              $regex: this.queryStr.keyword,
              $options: "i",
            },
          }
        : {};

      this.query = this.query.find({ ...keyword });
    }
    return this;
  }
}

module.exports = ApiFeatures;
