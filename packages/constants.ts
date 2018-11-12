/** We will provide sizes for this */

export const HASH_TRYTE_SIZE = 81;
export const TAG_TRYTE_SIZE = 27;
export const SIGNATURE_MESSAGE_FRAGMENT_TRYTE_SIZE = 2187;
export const TRANSACTION_TRYTE_SIZE = 2673;

export const MAX_INDEX_DIFF = 1000;

export const NULL_HASH_HBYTES = "9".repeat(HASH_TRYTE_SIZE);
export const NULL_TAG_HBYTES = "9".repeat(TAG_TRYTE_SIZE);
export const NULL_SIGNATURE_MESSAGE_FRAGMENT_HBYTES = "9".repeat(
  SIGNATURE_MESSAGE_FRAGMENT_TRYTE_SIZE
);
export const NULL_TRANSACTION_HBYTES = "9".repeat(TRANSACTION_TRYTE_SIZE);
