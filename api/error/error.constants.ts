export const errors = {
  BAD_REQUEST: {
    httpStatus: 400,
    message: "Bad Request.",
  },
  INTERNAL_SERVER_ERROR: {
    httpStatus: 500,
    message: "Internal Server Error.",
  },
  UNAUTHORIZED: {
    httpStatus: 401,
    message: "Unauthorized.",
  },
  NOT_FOUND: {
    httpStatus: 404,
    message: "Resource Not Found.",
  },
  MONGODB_CONNECT_ERROR: {
    httpStatus: 500,
    message: "Could Not Connect to MongoDB.",
  },
  JWT_ERROR: {
    httpStatus: 403,
    message: "JWT Token Not Found.",
  },
  ACCOUNT_EXISTS: {
    httpStatus: 400,
    message: "Account already exists. Please login",
  },
  WRONG_CREDS: {
    httpStatus: 400,
    message: "Wrong email or password.",
  },
  SOCKETIO_CONNECT_ERROR: {
    httpStatus: 500,
    message: "Could Not Connect to Socket.IO.",
  },
};
