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
