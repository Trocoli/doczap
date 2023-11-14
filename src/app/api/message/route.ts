import { SendMessageValidator } from "@/app/lib/validators/SendMessageValidator";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  // endpoint to ask question to pdf file

  const body = await req.json();
  const { getUser } = getKindeServerSession();
  const user = getUser();

  const { id: userId } = user;
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { fileId, message } = SendMessageValidator.parse(body);

  const file = await db.file.findFirst({ where: { id: fileId, userId } });

  if (!file) {
    return new Response("Not Found", { status: 404 });
  }

  await db.message.create()
};
