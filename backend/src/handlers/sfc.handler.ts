import type { Request, Response } from "express";
import BadRequestError from "../errors/bad-request.js";
import { prisma } from "../config/db.js";
import { sendSuccess } from "../utils/response-formatter.js";
import { StatusCodes } from "http-status-codes";

type OwnershipType = "mine" | "notmine" | "inactive" | "unknown";

export const checkOwnership = async (
  req: Request<{ sfcToken: string }>,
  res: Response,
) => {
  const token = req.params.sfcToken;

  if (!token) {
    throw new BadRequestError(
      `Can't check ownership of nother! token received: ${token}`,
    );
  }

  const sfc = await prisma.sfcDevice.findUnique({
    where: { hardwareToken: token },
  });

  let data: OwnershipType | undefined = undefined;
  /** TODO: We will later add every SFC to our SFC registry.
   * This means that we shall have inactive tags and their ownership will be tagged as "inactive"
   * !sfc => "unknown"
   * !!sfc.status === "INACTIVE" => "inactive"
   */

  if (!sfc || sfc.status === "INACTIVE") {
    data = "unknown";
    sendSuccess(res, data, "Ownership check complete!", StatusCodes.OK);
    return;
  }

  // fetch the owners data
  const user = await prisma.user.findUnique({
    where: { firebaseUid: req.user!.uid },
  });

  if (user!.id === sfc.userId) {
    data = "mine";
  } else {
    data = "notmine";
  }

  sendSuccess(res, data, "Ownership check complete!", StatusCodes.OK);
};
