
if (typeof process !== "undefined" && process.env) {
    const dotenv = await import("dotenv");
    dotenv.config();
}

export const imgBBAPI = import.meta.env.VITE_IMGBB_API_KEY || "";

export const smtp = {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "",
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "",
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "",
    privateKey: import.meta.env.VITE_EMAILJS_PRIVATE_KEY || ""
};
