module.exports = {
  attributes: {
    site: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    requestOptions: {
      type: Mixed,
      required: true,
    },
    sitemap: {
      type: Mixed,
      required: true,
    },
    transform: {
      type: Mixed,
    },
    pageRule: {
      type: String,
    },
  },
};
