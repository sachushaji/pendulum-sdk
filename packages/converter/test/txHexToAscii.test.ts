import test from "ava";
import * as errors from "../src/errors";
import { txHexToAscii } from "../src";

const { INVALID_ODD_LENGTH, INVALID_TX_HEX } = errors;

test("txHexToAscii()", t => {
  const txHex = "494f5441";
  const expected = "IOTA";

  const nonTxHex = "AAAfasds";
  const txHexOfOddLength = "aaa";

  t.is(
    txHexToAscii(txHex),
    expected,
    "fromTxHex() should convert transactionStrings to ascii."
  );

  const invalidTxHexError = t.throws(
    () => txHexToAscii(nonTxHex),
    Error,
    "fromTxHex() should throw error for non-transactionStrings."
  );

  t.is(invalidTxHexError.message, INVALID_TX_HEX, "incorrect error message");

  const oddLengthError = t.throws(
    () => txHexToAscii(txHexOfOddLength),
    Error,
    "fromTxHex() should throw error for transactionStrings of odd length."
  );

  t.is(oddLengthError.message, INVALID_ODD_LENGTH, "incorrect error message");
});