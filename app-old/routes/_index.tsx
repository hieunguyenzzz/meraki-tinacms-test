import { redirect, LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const acceptLanguage = request.headers.get("Accept-Language");
  
  // Simple language detection based on Accept-Language header
  const preferredLang = acceptLanguage?.includes("vi") ? "vi" : "en";
  
  return redirect(`/${preferredLang}`, 302);
};

export default function Index() {
  return null;
}