/**
 * Represents the exchange rate between two currencies.
 */
export interface ExchangeRate {
  /**
   * The rate to convert from the source currency to the target currency.
   */
  rate: number;
}

/**
 * Asynchronously retrieves the exchange rate between two currencies.
 * @param sourceCurrency The source currency code (e.g., 'USD').
 * @param targetCurrency The target currency code (e.g., 'EUR').
 * @returns A promise that resolves to an ExchangeRate object containing the exchange rate.
 */
export async function getExchangeRate(
  sourceCurrency: string,
  targetCurrency: string
): Promise<ExchangeRate> {
  // TODO: Implement this by calling an API.

  return {
    rate: 1.2,
  };
}
