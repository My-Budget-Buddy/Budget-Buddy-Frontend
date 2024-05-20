/**
 * Get a string formatted in the form of US Currency, without the leading currency symbol. Accepts a string or number type.
 *
 * For example: `12000.467` -> `12,000.47`.
 *
 * @export
 * @param {(string | number)} value The value to format. A valid string must be provided.
 * @param {boolean} [includeSymbol=false] Whether to include the currency symbol in the result. Default `true`.
 * @return {*}  {string} Example: `12,000.00`
 */
export function formatCurrency(value: string | number, includeSymbol: boolean = true): string {
    const valueNum = typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(valueNum))
        throw new Error("Invalid Value. Please provide a valid number or string that can be correctly converted.");

    const fm = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    });

    if (!includeSymbol) return fm.format(valueNum).slice(1);
    return fm.format(valueNum);
}
