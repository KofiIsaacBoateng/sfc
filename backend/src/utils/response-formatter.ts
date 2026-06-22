import type { Response } from "express";

export const sendSuccess = (
  res: Response,
  data: any,
  message = "Success",
  statusCode = 200,
) => {
  return res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
};
