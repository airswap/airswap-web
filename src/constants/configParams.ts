/**
 * Time in milliseconds before a quote expires that new quotes will be fetched.
 * This time should be sufficient for a user to take an order and have a
 * reasonable expectation that it will be mined within this buffer time.
 */
export const RFQ_EXPIRY_BUFFER_MS = 60 * 1000;

/**
 * In the event that an order has an expiry very close to RFQ_EXPIRY_BUFFER
 * we will re-request it closer to the expiry than we would otherwise to prevent
 * constantly re-requesting orders. This gives the user a fair amount of time to
 * evaluate and accept the order.
 */
export const RFQ_MINIMUM_REREQUEST_DELAY_MS = 30 * 1000;

/**
 * This is the period of time within which we must receive a response from an
 * indexer node in order for us to use it.
 */
export const INDEXER_ORDER_RESPONSE_TIME_MS = 4000;

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

/**
 * Interval at which to update the reference prices for gas and token prices
 * that are used when determining the best order to estimate the approximate
 * impact of the gas cost for RFQ transactions.
 */
export const REFERENCE_PRICE_UPDATE_INTERVAL_MS = 24 * 1000;
