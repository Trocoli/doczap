import { SendMessageValidator } from "@/app/lib/validators/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
 // endpoint to ask question to pdf file

 const body = await req.json()
 const {getUser} = getKindeServerSession()
 const user = getUser()

 const {id: userId} = user
 if (!userId) return new Response('Unauthorized', {status: 401})

 const {} = SendMessageValidator.parse(body)
} 