import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../models/userModel";
import { Response } from "express";
import { uploadFile } from "../utils/cloudinary";
import { oAuth2Client } from "../utils/googleConfig";
import axios from "axios";

function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// generate access token and refresh token
const generateTokens = async (userId: string, res: Response) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json(new ApiResponse(404, null, "User not found"));
      return null;
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          "Something went wrong while generating tokens"
        )
      );
    return null;
  }
};

// register user
const userRegister = asyncHandler(async (req, res) => {
  // get data from req.body
  const { name, email, password, confirmPassword } = req.body;

  // validate data
  if (!name || !email || !password || !confirmPassword) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Please provide all required fields."));
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          null,
          "Password must be at least 6 characters long."
        )
      );
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Passwords do not match."));
  }

  if (name.length < 3) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, null, "Name must be at least 3 characters long.")
      );
  }
  if (name.length > 30) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, null, "Name must be at most 30 characters long.")
      );
  }
  if (!validateEmail(email)) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, null, "Please provide a valid email address.")
      );
  }

  // check user already exists
  if (await User.findOne({ email })) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "User already exists."));
  }

  // get avatar and validate
  const avatar = req.file;
  if (!avatar) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Please provide an avatar."));
  }

  //upload avatar to cloudinary
  const avatarUrl = await uploadFile(avatar);

  // create user
  const user = await User.create({
    name,
    email,
    password,
    avatar: avatarUrl,
  });

  // validate user created
  const createdUser = await User.findOne({ _id: user._id });

  if (!createdUser) {
    return res
      .status(500)
      .json(
        new ApiResponse(500, null, "Something went wrong while creating user.")
      );
  }

  // send response
  return res
    .status(201)
    .json(new ApiResponse(201, null, "User created successfully."));
});

// login user
const userLogin = asyncHandler(async (req, res) => {
  // get data from req.body
  const { email, password } = req.body;

  // validate data
  if (!email || !password) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Please provide all required fields."));
  }

  // check user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Invalid credentials."));
  }

  // check password
  if (!(await user.comparePassword(password))) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Invalid credentials."));
  }

  // generate tokens
  const tokens = await generateTokens(user._id, res);
  if (!tokens) {
    return; // Exit if tokens generation failed
  }
  const { accessToken, refreshToken } = tokens;

  const updatedUser = await User.findOne({ _id: user._id }).select(
    "-password -avatar -createdAt -updatedAt -__v"
  );

  // send response
  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 24 * 60 * 60 * 1000,
    })
    .json(new ApiResponse(200, updatedUser, "Login successful."));
});

// logout user
const userLogout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        refreshToken: null,
      },
    },
    {
      new: true,
    }
  );
  // send response
  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, null, "Logout successful."));
});

const userDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select(
    "-password -refreshToken -__v"
  );
  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found."));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User found successfully."));
});

// google auth
const googleAuth = asyncHandler(async (req, res) => {
  try {
    const { token } = req.body;

    if (!token || token === "undefined" || typeof token !== "string") {
      return res
        .status(400)
        .json(
          new ApiResponse(400, {}, "Token is required and must be a string")
        );
    }

    const googleRes = await oAuth2Client.getToken(token);
    oAuth2Client.setCredentials(googleRes.tokens);

    if (!googleRes.tokens.access_token) {
      return res
        .status(500)
        .json(
          new ApiResponse(
            500,
            {},
            "Something went wrong while generating access token"
          )
        );
    }

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );

    if (!userRes.data) {
      return res
        .status(500)
        .json(
          new ApiResponse(
            500,
            {},
            "Something went wrong while fetching user details"
          )
        );
    }

    const { email, name, picture } = userRes.data;

    if (!email || !name || !picture) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Email, name, picture are not found"));
    }

    const user = await User.findOne({ email });

    if (!user) {
      const user = await User.create({
        email,
        name,
        password: Math.random().toString(36).slice(-8),
        avatar: picture,
      });
      // generate tokens
      const tokens = await generateTokens(user._id, res);
      if (!tokens) {
        return; // Exit if tokens generation failed
      }
      const { accessToken, refreshToken } = tokens;

      const loggedInUser = await User.findById(user._id).select(
        "-password -avatar -createdAt -updatedAt -__v"
      );

      // send response
      return res
        .status(200)
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 24 * 60 * 60 * 1000,
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 60 * 24 * 60 * 60 * 1000,
        })
        .json(
          new ApiResponse(200, loggedInUser, "Sign up successful with google")
        );
    } else {
      // change avatar
      user.avatar = picture;
      await user.save({ validateBeforeSave: false });
      // generate tokens
      const tokens = await generateTokens(user._id, res);
      if (!tokens) {
        return; // Exit if tokens generation failed
      }
      const { accessToken, refreshToken } = tokens;
      const loggedInUser = await User.findById(user._id).select(
        "-password -avatar -createdAt -updatedAt -__v"
      );

      // send response
      return res
        .status(200)
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 24 * 60 * 60 * 1000,
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 60 * 24 * 60 * 60 * 1000,
        })
        .json(
          new ApiResponse(200, loggedInUser, "Sign in successful with google")
        );
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Something went wrong"));
  }
});

export { userRegister, userLogin, userLogout, userDetails, googleAuth };
