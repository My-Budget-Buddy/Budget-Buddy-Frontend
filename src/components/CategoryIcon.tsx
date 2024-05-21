import React from "react";
import { Icon } from "@trussworks/react-uswds";
// define type
export type TransactionCategory =
    | "GROCERIES"
    | "ENTERTAINMENT"
    | "DINING"
    | "TRANSPORTATION"
    | "HEALTHCARE"
    | "LIVING_EXPENSES"
    | "SHOPPING"
    | "INCOME"
    | "MISC";

const categoryIcons: { [key in TransactionCategory]: React.ElementType } = {
    GROCERIES: Icon.LocalGroceryStore,
    ENTERTAINMENT: Icon.Youtube,
    DINING: Icon.Restaurant,
    TRANSPORTATION: Icon.DirectionsCar,
    HEALTHCARE: Icon.MedicalServices,
    LIVING_EXPENSES: Icon.Home,
    SHOPPING: Icon.Clothes,
    INCOME: Icon.TrendingUp,
    MISC: Icon.MoreHoriz
};

interface CategoryIconProps {
    category: TransactionCategory;
    color: string; // pass color as a prop
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ category, color }) => {
    const IconComponent = categoryIcons[category];
    return <IconComponent style={{ color, fontSize: "1.4rem", marginRight: "0.8rem" }} />;
};

export default CategoryIcon;
