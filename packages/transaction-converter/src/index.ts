/** @module transaction-converter */

import { hBitsToHBytes, hbytesToHBits, value } from "@helix/converter";
import { transactionHash } from "@helix/transaction";
import HHash from "@helix/hash-module";
import { padHBits, padHBytes } from "@helix/pad";
import * as errors from "../../errors";
import { isHBytesOfExactLength } from "../../guards";
import { asArray, Hash, Transaction, HBytes } from "../../types";
import {
  ADDRESS_BYTE_SIZE,
  OBSOLETE_TAG_BYTE_SIZE,
  TRANSACTION_CURRENT_INDEX_BITS_SIZE,
  TRANSACTION_LAST_INDEX_BITS_SIZE,
  TRANSACTION_TIMESTAMP_BITS_SIZE,
  TRANSACTION_VALUE_BITS_SIZE,
  SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE,
  TRANSACTION_HBYTE_SIZE,
  TRANSACTION_VALUE_BYTE_SIZE,
  TRANSACTION_TIMESTAMP_BYTE_SIZE,
  TRANSACTION_CURRENT_INDEX_BYTE_SIZE,
  HASH_BYTE_SIZE,
  TAG_BYTE_SIZE,
  TRANSACTION_LAST_INDEX_BYTE_SIZE,
  NONCE_BYTE_SIZE,
  TRANSACTION_TIMESTAMP_UPPER_BOUND_SIZE,
  TRANSACTION_TIMESTAMP_LOWER_BOUND_SIZE
} from "../../constants";

export function asTransactionHBytes(transactions: Transaction): HBytes;
export function asTransactionHBytes(
  transactions: ReadonlyArray<Transaction>
): ReadonlyArray<HBytes>;
/**
 * Converts a transaction object or a list of those into transaction hbytes.
 *
 * @method asTransactionHBytes
 *
 * @param {Transaction | Transaction[]} transactions - Transaction object(s)
 *
 * @return {HBytes | HBytes[]} Transaction hbytes
 */
export function asTransactionHBytes(
  transactions: Transaction | ReadonlyArray<Transaction>
): HBytes | ReadonlyArray<HBytes> {
  const txHBytes = asArray(transactions).map(transaction =>
    [
      transaction.signatureMessageFragment,
      transaction.address,
      hBitsToHBytes(
        padHBits(TRANSACTION_VALUE_BITS_SIZE)(hbytesToHBits(transaction.value))
      ),
      padHBytes(OBSOLETE_TAG_BYTE_SIZE)(transaction.obsoleteTag),
      hBitsToHBytes(
        padHBits(TRANSACTION_TIMESTAMP_BITS_SIZE)(
          hbytesToHBits(transaction.timestamp)
        )
      ),
      hBitsToHBytes(
        padHBits(TRANSACTION_CURRENT_INDEX_BITS_SIZE)(
          hbytesToHBits(transaction.currentIndex)
        )
      ),
      hBitsToHBytes(
        padHBits(TRANSACTION_LAST_INDEX_BITS_SIZE)(
          hbytesToHBits(transaction.lastIndex)
        )
      ),
      transaction.bundle,
      transaction.trunkTransaction,
      transaction.branchTransaction,
      padHBytes(OBSOLETE_TAG_BYTE_SIZE)(
        transaction.tag || transaction.obsoleteTag
      ),
      hBitsToHBytes(
        padHBits(TRANSACTION_TIMESTAMP_BITS_SIZE)(
          hbytesToHBits(transaction.attachmentTimestamp)
        )
      ),
      hBitsToHBytes(
        padHBits(TRANSACTION_TIMESTAMP_BITS_SIZE)(
          hbytesToHBits(transaction.attachmentTimestampLowerBound)
        )
      ),
      hBitsToHBytes(
        padHBits(TRANSACTION_TIMESTAMP_BITS_SIZE)(
          hbytesToHBits(transaction.attachmentTimestampUpperBound)
        )
      ),
      transaction.nonce
    ].join("")
  );

  return Array.isArray(transactions) ? txHBytes : txHBytes[0];
}

/**
 * Converts transaction hbytes of 2673 hbytes into a transaction object.
 *
 * @method asTransactionObject
 *
 * @param {HBytes} hbytes - Transaction hbytes
 *
 * @return {Transaction} Transaction object
 */
export const asTransactionObject = (
  hbytes: HBytes,
  hash?: Hash
): Transaction => {
  if (!isHBytesOfExactLength(hbytes, TRANSACTION_HBYTE_SIZE)) {
    throw new Error(errors.INVALID_HBYTES);
  }

  const hbits = hbytesToHBits(hbytes);

  const noOfBitsInBytes = 3;
  const usefulBytesFromValue = 11;
  const noOfBitsInValue = noOfBitsInBytes * usefulBytesFromValue;

  const startIndexSignMsgFragBytes = 0;

  const startIndexAddressBytes =
    startIndexSignMsgFragBytes + SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE;
  const startIndexValueBytes = startIndexAddressBytes + ADDRESS_BYTE_SIZE;
  const startIndexObsoleteTagBytes =
    startIndexValueBytes + TRANSACTION_VALUE_BYTE_SIZE;

  // todo check here
  // Value is represented using 27 trytes: 2268 -> 2295
  // Trits index 6804 -> 6885
  // Only first 11 trytes are used to store value all the other are expected to be 0
  for (
    let i = startIndexValueBytes + usefulBytesFromValue;
    i < startIndexObsoleteTagBytes;
    i++
  ) {
    if (hbytes.charAt(i) !== "9") {
      throw new Error(errors.INVALID_HBYTES);
    }
  }

  const startIndexTimestampBytes =
    startIndexObsoleteTagBytes + OBSOLETE_TAG_BYTE_SIZE;
  const startIndexCurrIndexBytes =
    startIndexTimestampBytes + TRANSACTION_TIMESTAMP_BYTE_SIZE;
  const startIndexLastIndexBytes =
    startIndexCurrIndexBytes + TRANSACTION_CURRENT_INDEX_BYTE_SIZE;
  const startIndexBundleBytes =
    startIndexLastIndexBytes + TRANSACTION_LAST_INDEX_BYTE_SIZE;
  const startIndexTrunkTrasnBytes = startIndexBundleBytes + HASH_BYTE_SIZE;
  const startIndexBranchTrasnBytes = startIndexTrunkTrasnBytes + HASH_BYTE_SIZE;
  const startIndexTagTrasnBytes = startIndexBranchTrasnBytes + HASH_BYTE_SIZE;
  const startIndexTimestampTrasnBytes = startIndexTagTrasnBytes + TAG_BYTE_SIZE;
  const startIndexTimestampLowTrasnBytes =
    startIndexTimestampTrasnBytes + TRANSACTION_TIMESTAMP_BYTE_SIZE;
  const startIndexTimestampUpTrasnBytes =
    startIndexTimestampLowTrasnBytes + TRANSACTION_TIMESTAMP_LOWER_BOUND_SIZE;
  const startIndexNonceBytes =
    startIndexTimestampUpTrasnBytes + TRANSACTION_TIMESTAMP_UPPER_BOUND_SIZE;

  // Can be removed after the model is fully converted
  // signatureMessageFragment: hbytes.slice(0, 2187),
  //   address: hbytes.slice(2187, 2268),
  //   value: value(hbits.slice(6804, 6837)),
  //   obsoleteTag: hbytes.slice(2295, 2322),
  //   timestamp: value(hbits.slice(6966, 6993)),
  //   currentIndex: value(hbits.slice(6993, 7020)),
  //   lastIndex: value(hbits.slice(7020, 7047)),
  //   bundle: hbytes.slice(2349, 2430),
  //   trunkTransaction: hbytes.slice(2430, 2511),
  //   branchTransaction: hbytes.slice(2511, 2592),
  //   tag: hbytes.slice(2592, 2619),
  //   attachmentTimestamp: value(hbits.slice(7857, 7884)),
  //   attachmentTimestampLowerBound: value(hbits.slice(7884, 7911)),
  //   attachmentTimestampUpperBound: value(hbits.slice(7911, 7938)),
  //   nonce: hbytes.slice(2646, 2673)

  return {
    hash: hash || transactionHash(hbits),
    signatureMessageFragment: hbytes.slice(
      startIndexSignMsgFragBytes,
      startIndexSignMsgFragBytes + SIGNATURE_MESSAGE_FRAGMENT_HBYTE_SIZE
    ),
    address: hbytes.slice(
      startIndexAddressBytes,
      startIndexAddressBytes + ADDRESS_BYTE_SIZE
    ),
    value: value(
      hbits.slice(
        startIndexValueBytes * noOfBitsInBytes,
        startIndexValueBytes * noOfBitsInBytes + noOfBitsInValue
      )
    ), // 33 trits?
    obsoleteTag: hbytes.slice(
      startIndexObsoleteTagBytes,
      startIndexObsoleteTagBytes + OBSOLETE_TAG_BYTE_SIZE
    ), // 27 trytes
    timestamp: value(
      hbits.slice(
        noOfBitsInBytes * startIndexTimestampBytes,
        noOfBitsInBytes *
          (startIndexTimestampBytes + TRANSACTION_TIMESTAMP_BYTE_SIZE)
      )
    ), // 27 trits => 9 trytes
    currentIndex: value(
      hbits.slice(
        noOfBitsInBytes * startIndexCurrIndexBytes,
        noOfBitsInBytes *
          (startIndexCurrIndexBytes + TRANSACTION_CURRENT_INDEX_BYTE_SIZE)
      )
    ), // 27 trits
    lastIndex: value(
      hbits.slice(
        startIndexLastIndexBytes * noOfBitsInBytes,
        noOfBitsInBytes *
          (startIndexLastIndexBytes + TRANSACTION_LAST_INDEX_BYTE_SIZE)
      )
    ), // 27 trits => 9 trytes
    bundle: hbytes.slice(
      startIndexBundleBytes,
      startIndexBundleBytes + HASH_BYTE_SIZE
    ), // 81 trytes
    trunkTransaction: hbytes.slice(
      startIndexTrunkTrasnBytes,
      startIndexTrunkTrasnBytes + HASH_BYTE_SIZE
    ), // 81 trytes
    branchTransaction: hbytes.slice(
      startIndexBranchTrasnBytes,
      startIndexBranchTrasnBytes + HASH_BYTE_SIZE
    ), // 81 trytes
    tag: hbytes.slice(
      startIndexTagTrasnBytes,
      startIndexTagTrasnBytes + TAG_BYTE_SIZE
    ), // 27 trytes
    attachmentTimestamp: value(
      hbits.slice(
        noOfBitsInBytes * startIndexTimestampTrasnBytes,
        noOfBitsInBytes *
          (startIndexTimestampTrasnBytes + TRANSACTION_TIMESTAMP_BYTE_SIZE)
      )
    ), //27 trits
    attachmentTimestampLowerBound: value(
      hbits.slice(
        noOfBitsInBytes * startIndexTimestampLowTrasnBytes,
        noOfBitsInBytes *
          (startIndexTimestampLowTrasnBytes +
            TRANSACTION_TIMESTAMP_LOWER_BOUND_SIZE)
      )
    ), //27 trits
    attachmentTimestampUpperBound: value(
      hbits.slice(
        noOfBitsInBytes * startIndexTimestampUpTrasnBytes,
        noOfBitsInBytes *
          (startIndexTimestampUpTrasnBytes +
            TRANSACTION_TIMESTAMP_UPPER_BOUND_SIZE)
      )
    ), //27 trits
    nonce: hbytes.slice(
      startIndexNonceBytes,
      startIndexNonceBytes + NONCE_BYTE_SIZE
    ) // 27 trytes
  };
};

/**
 * Converts a list of transaction hbytes into list of transaction objects.
 * Accepts a list of hashes and returns a mapper. In cases hashes are given,
 * the mapper function map them to converted objects.
 *
 * @method asTransactionObjects
 *
 * @param {Hash[]} [hashes] - Optional list of known hashes.
 * Known hashes are directly mapped to transaction objects,
 * otherwise all hashes are being recalculated.
 *
 * @return {Function} {@link #module_transaction.transactionObjectsMapper `transactionObjectsMapper`}
 */
export const asTransactionObjects = (hashes?: ReadonlyArray<Hash>) => {
  /**
   * Maps the list of given hashes to a list of converted transaction objects.
   *
   * @method transactionObjectsMapper
   *
   * @param {HBytes[]} hbytes - List of transaction hbytes to convert
   *
   * @return {Transaction[]} List of transaction objects with hashes
   */
  return function transactionObjectsMapper(hbytes: ReadonlyArray<HBytes>) {
    return hbytes.map((hByteString, i) =>
      asTransactionObject(hByteString, hashes![i])
    );
  };
};

export const asFinalTransactionHBytes = (
  transactions: ReadonlyArray<Transaction>
) => [...asTransactionHBytes(transactions)].reverse();

export const transactionObject = (hBytes: HBytes): Transaction => {
  /* tslint:disable-next-line:no-console */
  console.warn("`transactionObject` has been renamed to `asTransactionObject`");

  return asTransactionObject(hBytes);
};

export const transactionHBytes = (transaction: Transaction): HBytes => {
  /* tslint:disable-next-line:no-console */
  console.warn("`transactionHBytes` has been renamed to `asTransactionHBytes`");

  return asTransactionHBytes(transaction);
};
