import i18next from "i18next";

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
    let valueNum = typeof value === "string" ? parseFloat(value) : value;
    if (!value) valueNum = 0;
    if (isNaN(valueNum))
        throw new Error("Invalid Value. Please provide a valid number or string that can be correctly converted.");

    const fm = new Intl.NumberFormat(i18next.t("locale"), {
        style: "currency",
        currency: "USD",
        currencyDisplay: "narrowSymbol"
    });

    if (!includeSymbol) return fm.format(valueNum).slice(1);
    return fm.format(valueNum);
}

export function formatDate(value: string) {
    const intDate: Date = new Date(value);
    const dateNum: number = intDate.getTime() + 86400000; //add one day
    const date: Date = new Date(dateNum);

    return Intl.DateTimeFormat(i18next.t("locale")).format(date);
}
