import { ZodError } from "zod";
import { AccountInputError } from "@/lib/account-api";

export async function serviceResult(operation,status=200) {
  try { return {success:true,status,...await operation()}; }
  catch(error) {
    if(error instanceof ZodError) return {success:false,status:400,message:error.issues[0].path.join(".")+" "+error.issues[0].message};
    if(error instanceof AccountInputError) return {success:false,status:error.status,message:error.message};
    if(error.code==="P2025") return {success:false,status:404,message:"Record unavailable."};
    throw error;
  }
}
