import React from "react";
import { Icon } from "@trussworks/react-uswds";
import { TransactionCategory } from "../types/models";

export const categoryIcons: { [key in TransactionCategory]: React.ElementType } = {
    [TransactionCategory.GROCERIES]: Icon.LocalGroceryStore,
    [TransactionCategory.ENTERTAINMENT]: Icon.Youtube,
    [TransactionCategory.DINING]: Icon.Restaurant,
    [TransactionCategory.TRANSPORTATION]: Icon.DirectionsCar,
    [TransactionCategory.HEALTHCARE]: Icon.MedicalServices,
    [TransactionCategory.LIVING_EXPENSES]: Icon.Home,
    [TransactionCategory.SHOPPING]: Icon.Clothes,
    [TransactionCategory.INCOME]: Icon.TrendingUp,
    [TransactionCategory.MISC]: Icon.MoreHoriz
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
