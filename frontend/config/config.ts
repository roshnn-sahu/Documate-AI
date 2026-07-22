export const API_BASE_URL = "/api";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";


export const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

export const CLOUDINARY_URL = process.env.CLOUDINARY_URL || "";


if(!SUPABASE_URL){
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL")
}
if(!SUPABASE_ANON_KEY){
  console.error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY")
}
if(!SUPABASE_SERVICE_ROLE_KEY){
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY")
}
if(!GROQ_API_KEY){
  console.error("Missing GROQ_API_KEY")
}
if(!OPENROUTER_API_KEY){
  console.error("Missing OPENROUTER_API_KEY")
}
if(!CLOUDINARY_URL){
  console.error("Missing CLOUDINARY_URL")
}