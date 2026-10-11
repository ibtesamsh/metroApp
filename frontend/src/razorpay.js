const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

let loadPromise = null;

/**
 * Injects the Razorpay checkout script only when it's actually needed
 * (i.e. when payment-config says Razorpay is enabled), rather than loading
 * it unconditionally on every page load.
 */
export const loadRazorpayScript = () => {
  if (window.Razorpay) return Promise.resolve(true);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.onload = () => resolve(true);
    script.onerror = () => {
      loadPromise = null;
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return loadPromise;
};
