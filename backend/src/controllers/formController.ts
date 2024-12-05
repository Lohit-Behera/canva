import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { Form } from "../models/formModel";
import { User } from "../models/userModel";
import { uploadFile } from "../utils/cloudinary";

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

const getForm = asyncHandler(async (req, res) => {
  const form = await Form.findById(req.params.id);
  if (!form) {
    return res.status(404).json(new ApiResponse(404, null, "Form not found."));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, form, "Form found successfully."));
});

export { createForm, getForm };
