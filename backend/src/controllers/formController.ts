import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { Form } from "../models/formModel";
import { User } from "../models/userModel";
import { uploadFile, deleteFile } from "../utils/cloudinary";
import mongoose from "mongoose";

const createForm = asyncHandler(async (req, res) => {
  // get user form req
  const user = await User.findById(req.user?._id);

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found."));
  }
  // get data from req.body
  const { firstName, lastName } = req.body;
  // validate data
  if (!firstName || !lastName) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Please provide all required fields."));
  }
  // get thumbnail from req.file
  const thumbnail = req.file;
  if (!thumbnail) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Please provide a thumbnail."));
  }
  // upload thumbnail to cloudinary
  const thumbnailUrl = await uploadFile(thumbnail);
  // create form
  const form = await Form.create({
    firstName,
    lastName,
    thumbnail: thumbnailUrl,
    user: user._id,
  });
  // validate form created
  const createdForm = await Form.findOne({ _id: form._id });
  if (!createdForm) {
    return res
      .status(500)
      .json(
        new ApiResponse(500, null, "Something went wrong while creating form.")
      );
  }
  // send response
  return res
    .status(201)
    .json(new ApiResponse(201, createdForm._id, "Form created successfully."));
});

// get form
const getForm = asyncHandler(async (req, res) => {
  // get form id from req.params
  const formId = req.params.formId;
  // aggregate form to get user data
  const form = await Form.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(formId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userData",
      },
    },
    {
      $unwind: {
        path: "$userData",
      },
    },
    {
      $project: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        thumbnail: 1,
        user: 1,
        userName: "$userData.name",
        userEmail: "$userData.email",
        userAvatar: "$userData.avatar",
      },
    },
  ]);
  // validate form
  if (!form) {
    return res.status(404).json(new ApiResponse(404, null, "Form not found."));
  }
  // send response
  return res
    .status(200)
    .json(new ApiResponse(200, form[0], "Form found successfully."));
});

// get all forms of user
const getAllForms = asyncHandler(async (req, res) => {
  // get user form req
  const user = await User.findById(req.user?._id);
  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found."));
  }
  // get all forms
  const forms = await Form.aggregate([
    {
      $match: { user: user._id },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userData",
      },
    },
    {
      $unwind: {
        path: "$userData",
      },
    },
    {
      $project: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        thumbnail: 1,
        user: 1,
        userName: "$userData.name",
        userEmail: "$userData.email",
        userAvatar: "$userData.avatar",
      },
    },
  ]);
  // validate forms
  if (!forms) {
    return res.status(404).json(new ApiResponse(404, null, "Forms not found."));
  }
  // send response
  return res
    .status(200)
    .json(new ApiResponse(200, forms, "Forms found successfully."));
});

// delete form
const deleteForm = asyncHandler(async (req, res) => {
  // get form id from req.params
  const formId = req.params.formId;
  // get form
  const form = await Form.findById(formId);
  if (!form) {
    return res.status(404).json(new ApiResponse(404, null, "Form not found."));
  }

  // check if form belongs to user
  if (form.user.toString() !== req.user?._id.toString()) {
    return res
      .status(403)
      .json(
        new ApiResponse(
          403,
          null,
          "You are not authorized to delete this form."
        )
      );
  }

  // delete thumbnail from cloudinary
  const publicId = form.thumbnail?.split("/")?.pop()?.split(".")[0] ?? null;
  if (publicId) {
    await deleteFile(publicId, res);
  }
  // delete form
  await Form.findByIdAndDelete(formId);
  // send response
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Form deleted successfully."));
});

export { createForm, getForm, getAllForms, deleteForm };
