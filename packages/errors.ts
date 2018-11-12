export const ILLEGAL_LENGTH = "Illegal trits length";
export const ILLEGAL_TRIT_CONVERSION_INPUT =
  "Illegal conversion input. Expected trits as Int8Array.";
export const ILLEGAL_TRYTE_CONVERSION_INPUT =
  "Illegal conversion input. Expected hbytes string or integer.";
export const INCONSISTENT_SUBTANGLE = "Inconsistent subtangle";
export const INSUFFICIENT_BALANCE = "Insufficient balance";
export const INVALID_ADDRESS = "Invalid address";
export const INVALID_REMAINDER_ADDRESS = "Invalid remainder address";
export const INVALID_BRANCH_TRANSACTION = "Invalid branch transaction";
export const INVALID_BUNDLE = "Invalid bundle";
export const INVALID_BUNDLE_HASH = "Invalid bundle hash";
export const INVALID_CHECKSUM = "Invalid checksum";
export const INVALID_COMMAND = "Invalid command format";
export const INVALID_DEPTH = "Invalid depth";
export const INVALID_HASH = "Invalid hash";
export const INVALID_INDEX = "Invalid index option";
export const INVALID_TOTAL_OPTION = "Invalid total option";
export const INVALID_INPUT = "Invalid input";
export const INVALID_KEY = "Invalid key value";
export const INVALID_MIN_WEIGHT_MAGNITUDE = "Invalid Min Weight Magnitude";
export const INVALID_SEARCH_KEY = "Invalid search key";
export const INVALID_SECURITY_LEVEL = "Invalid security option";
export const INVALID_SECURITY_OPTION = "Invalid security option";
export const INVALID_SEED = "Invalid seed";
export const INVALID_START_END_OPTIONS = "Invalid end option";
export const INVALID_START_OPTION = "Invalid start option";
export const INVALID_TAG = "Invalid tag";
export const INVALID_TRANSACTION = "Invalid transaction";
export const INVALID_TRANSACTION_HBYTES = "Invalid transaction hbytes";
export const INVALID_ATTACHED_HBYTES = "Invalid attached hbytes";
export const INVALID_TRANSACTION_HASH = "Invalid transaction hash";
export const INVALID_TAIL_TRANSACTION = "Invalid tail transaction";
export const INVALID_THRESHOLD = "Invalid threshold option";
export const INVALID_TRANSFER = "Invalid transfer object";
export const INVALID_TRUNK_TRANSACTION = "Invalid trunk transaction";
export const INVALID_REFERENCE_HASH = "Invalid reference hash";
export const INVALID_HBYTES = "Invalid hbytes";
export const INVALID_URI = "Invalid uri";
export const INVALID_ASCII_INPUT =
  "Conversion to hbytes requires type of input to be encoded in ascii.";
export const INVALID_ODD_LENGTH =
  "Conversion from hbytes requires length of hbytes to be even.";
export const INVALID_TRYTE_ENCODED_JSON = "Invalid tryte encoded JSON message";
export const NOT_INT = "One of the inputs is not integer";
export const SENDING_BACK_TO_INPUTS =
  "One of the transaction inputs is used as output.";
export const INVALID_TRANSACTIONS_TO_APPROVE =
  "Invalid transactions to approve.";
export const NO_INPUTS = "Could not find any available inputs.";
export const invalidChecksum = (address: string) =>
  `Invalid Checksum: ${address}`;
export const inconsistentTransaction = (reason: string) =>
  `Transaction is inconsistent. Reason: ${reason}`;
