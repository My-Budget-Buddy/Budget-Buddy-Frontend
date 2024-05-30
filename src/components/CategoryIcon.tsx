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
export const categoryColors: { [key in TransactionCategory]: string } = {
    [TransactionCategory.GROCERIES]: "#90c8f4",
    [TransactionCategory.ENTERTAINMENT]: "#e5d23a",
    [TransactionCategory.DINING]: "#6ed198",
    [TransactionCategory.TRANSPORTATION]: "#af98f9",
    [TransactionCategory.HEALTHCARE]: "#fd6d6d",
    [TransactionCategory.LIVING_EXPENSES]: "#5a7ffa",
    [TransactionCategory.SHOPPING]: "#fe992b",
    [TransactionCategory.INCOME]: "#f7b7e5",
    [TransactionCategory.MISC]: "#dce2e1"
};

interface CategoryIconProps {
    category: TransactionCategory;
    color: string; // pass color as a prop
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ category, color }) => {
    const IconComponent = categoryIcons[category];
    return <IconComponent style={{ color, fontSize: "1.3rem", marginRight: "0.8rem" }} />;
};

export default CategoryIcon;
