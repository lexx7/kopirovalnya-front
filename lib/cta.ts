export const CALLBACK_EVENT = "kopirovalnya:callback";

export interface CallbackDetails {
  productSlug?: string;
  productName?: string;
}

export function openCallbackModal(details?: CallbackDetails) {
  window.dispatchEvent(new CustomEvent(CALLBACK_EVENT, { detail: details ?? null }));
}
