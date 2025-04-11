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
 * Asynchronously retrieves the exchange rate between two currencies using the exchangerate.host API.
 * @param sourceCurrency The source currency code (e.g., 'USD').
 * @param targetCurrency The target currency code (e.g., 'EUR').
 * @returns A promise that resolves to an ExchangeRate object containing the exchange rate.
 */
export async function getExchangeRate(
  sourceCurrency: string,
  targetCurrency: string
): Promise<ExchangeRate> {
  const apiUrl = `https://api.exchangerate.host/convert?from=${sourceCurrency}&to=${targetCurrency}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.success) {
      return {
        rate: data.result,
      };
    } else {
      throw new Error(data.error.message || 'Failed to retrieve exchange rate.');
    }
  } catch (error: any) {
    console.error("Error fetching exchange rate:", error);
    throw new Error(error.message || 'Failed to retrieve exchange rate.');
  }
}

    