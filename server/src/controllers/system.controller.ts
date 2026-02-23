import { asyncHandler } from "../utils/asyncHandler";
import { AuthedRequest } from "../middleware/auth";
import { ApiError } from "../utils/apiError";
import { runAutomationInternal } from "../services/automation.service";

export const runAutomation = asyncHandler(async (req: AuthedRequest, res) => {

  if (req.user?.role !== "admin")
    throw new ApiError(403, "Only admin can run automation");

  const result = await runAutomationInternal();

  res.json(result);
});