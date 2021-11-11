/**
 * Time in milliseconds before a quote expires that new quotes will be fetched.
 * This time should be sufficient for a user to take an order and have a
 * reasonable expectation that it will be mined within this buffer time.
 */
export const RFQ_EXPIRY_BUFFER_MS = 60 * 1000;

/**
 * Time in seconds of last look order expiry duration
 */
export const LAST_LOOK_ORDER_EXPIRY_SEC = 2 * 60;

/**
 * Time to wait after a swap has expired
 */
export const ASSUMED_EXPIRY_NOTIFICATION_BUFFER_MS = 20 * 1000;

/**
 * Time to wait for quotes before presenting "no peers" message.
 */
export const RECEIVE_QUOTE_TIMEOUT_MS = 5 * 1000;

/**
 * Time to wait between receiving the first quote from a maker
 * to let other quotes come in from other makers before displaying
 * a price.
 */
export const ADDITIONAL_QUOTE_BUFFER = 2 * 1000;
