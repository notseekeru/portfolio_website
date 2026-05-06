import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactRequestBody {
  name?: string;
  email?: string;
  message?: string;
}

router.post("/", (req: Request, res: Response) => {
  const { name, email, message } = req.body as ContactRequestBody;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string"
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (name.trim().length < 2 || name.trim().length > 50) {
    return res.status(400).json({ error: "Invalid name (2-50 characters)" });
  }

  if (!EMAIL_REGEX.test(email) || email.trim().length > 254) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  if (message.trim().length < 10 || message.trim().length > 500) {
    return res
      .status(400)
      .json({ error: "Message too long or too short (10-500 characters)" });
  }

  return res.status(200).json({ success: true });
});

export default router;
