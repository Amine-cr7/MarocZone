const Ad = require("../models/Ad");
const Subcategory = require("../models/Subcategory");
const FieldTemplate = require("../models/Fieldtemplate");
const ErrorResponse = require("../utils/ErrorResponse");
const path = require("path");

// ─── Helpers ──────────────────────────────────────────────────────────────────

const validateFields = async (subcategoryId, fields = {}) => {
  const templates = await FieldTemplate.find({ subcategory: subcategoryId }).lean();

  for (const template of templates) {
    const value = fields[template.name];

    // check required fields
    if (template.required && (value === undefined || value === null || value === "")) {
      throw new ErrorResponse(`Field "${template.label}" is required`, 400);
    }

    if (value === undefined || value === null) continue;

    // validate by type
    switch (template.type) {
      case "number":
        if (isNaN(value)) throw new ErrorResponse(`Field "${template.label}" must be a number`, 400);
        if (template.min !== undefined && value < template.min)
          throw new ErrorResponse(`Field "${template.label}" must be at least ${template.min}`, 400);
        if (template.max !== undefined && value > template.max)
          throw new ErrorResponse(`Field "${template.label}" must be at most ${template.max}`, 400);
        break;

      case "select":
        if (!template.options.includes(value))
          throw new ErrorResponse(`Invalid value for "${template.label}"`, 400);
        break;

      case "multiselect":
        if (!Array.isArray(value))
          throw new ErrorResponse(`Field "${template.label}" must be an array`, 400);
        if (!value.every((v) => template.options.includes(v)))
          throw new ErrorResponse(`Invalid value(s) for "${template.label}"`, 400);
        break;

      case "boolean":
        if (typeof value !== "boolean")
          throw new ErrorResponse(`Field "${template.label}" must be true or false`, 400);
        break;
    }
  }
};

// ─── Service Methods ──────────────────────────────────────────────────────────

const getAllAds = async (filter = {}) => {
  const query = { status: "published" };

  if (filter.category) query.category = filter.category;
  if (filter.subcategory) query.subcategory = filter.subcategory;
  if (filter.location) query.location = new RegExp(filter.location, "i");
  if (filter.minPrice || filter.maxPrice) {
    query.price = {};
    if (filter.minPrice) query.price.$gte = Number(filter.minPrice);
    if (filter.maxPrice) query.price.$lte = Number(filter.maxPrice);
  }

  return await Ad.find(query)
    .populate("category", "name icon")
    .populate("subcategory", "name")
    .populate("user", "fullName phone")
    .sort({ createdAt: -1 })
    .lean();
};

const getAdById = async (id) => {
  const ad = await Ad.findById(id)
    .populate("category", "name icon")
    .populate("subcategory", "name")
    .populate("user", "fullName phone");

  if (!ad) throw new ErrorResponse(`Ad not found with id: ${id}`, 404);

  // increment views
  ad.views += 1;
  await ad.save();

  return ad;
};

const getAdsByUser = async (userId) => {
  return await Ad.find({ user: userId })
    .populate("category", "name icon")
    .populate("subcategory", "name")
    .sort({ createdAt: -1 })
    .lean();
};

const createAd = async (data, userId) => {
  const subcategory = await Subcategory.findById(data.subcategory);
  if (!subcategory) {
    throw new ErrorResponse(`Subcategory not found with id: ${data.subcategory}`, 404);
  }

  await validateFields(data.subcategory, data.fields);

  return await Ad.create({ ...data, user: userId, status: "draft" });
};

const updateAd = async (id, data, userId) => {
  const ad = await Ad.findById(id);
  if (!ad) throw new ErrorResponse(`Ad not found with id: ${id}`, 404);

  if (ad.user.toString() !== userId) {
    throw new ErrorResponse("You are not authorized to update this ad", 403);
  }

  if (data.fields) {
    const subcategoryId = data.subcategory || ad.subcategory;
    await validateFields(subcategoryId, data.fields);
  }

  return await Ad.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate("category", "name icon")
    .populate("subcategory", "name")
    .lean();
};

const deleteAd = async (id, userId) => {
  const ad = await Ad.findById(id);
  if (!ad) throw new ErrorResponse(`Ad not found with id: ${id}`, 404);

  if (ad.user.toString() !== userId) {
    throw new ErrorResponse("You are not authorized to delete this ad", 403);
  }

  await ad.deleteOne();
};

const getPopularAds = async(req,res) => {
    const ads = await Ad.find().sort({views : -1}).limit(10).populate('category')
    return ads;
};

const uploadAdPhotos = async (id, userId, files, env) => {
  const ad = await Ad.findById(id);
  if (!ad) throw new ErrorResponse("Ad not found", 404);

  if (ad.user.toString() !== userId) {
    throw new ErrorResponse("You are not authorized to upload photos for this ad", 403);
  }

  if (!files || !files.files) throw new ErrorResponse("No files uploaded", 400);

  let fileList = Array.isArray(files.files) ? files.files : [files.files];

  const uploadedFileNames = [];

  for (const file of fileList) {
    if (!file.mimetype.startsWith("image")) {
      throw new ErrorResponse(`File "${file.name}" is not an image`, 400);
    }

    if (file.size > env.MAX_FILE_UPLOAD) {
      throw new ErrorResponse(`File "${file.name}" exceeds the size limit`, 400);
    }

    const fileName = `photo_${ad._id}_${Date.now()}_${file.name}`;
    const uploadPath = path.join(env.FILE_UPLOAD_PATH, fileName);

    await new Promise((resolve, reject) => {
      file.mv(uploadPath, (err) => (err ? reject(new ErrorResponse("File upload failed", 500)) : resolve()));
    });

    uploadedFileNames.push(fileName);
  }

  ad.images = uploadedFileNames;
  ad.status = "published";
  await ad.save();

  return uploadedFileNames;
};

module.exports = {
  getAllAds,
  getAdById,
  getAdsByUser,
  createAd,
  updateAd,
  deleteAd,
  getPopularAds,
  uploadAdPhotos,
};