import { Icon } from "@trussworks/react-uswds";
import { TransactionCategory } from "../../../../types/models";

const categoryIconsMap = new Map<string, React.ReactNode>();
categoryIconsMap.set(
    TransactionCategory.GROCERIES,
    <Icon.LocalGroceryStore style={{ color: "#90c8f4", fontSize: "1.3rem", marginRight: "0.8rem" }} />
);
categoryIconsMap.set(
    TransactionCategory.ENTERTAINMENT,
    <Icon.Youtube style={{ color: "#e5d23a", fontSize: "1.3rem", marginRight: "0.8rem" }} />
);
categoryIconsMap.set(
    TransactionCategory.DINING,
    <Icon.Restaurant style={{ color: "#6ed198", fontSize: "1.3rem", marginRight: "0.8rem" }} />
);
categoryIconsMap.set(
    TransactionCategory.TRANSPORTATION,
    <Icon.DirectionsCar style={{ color: "#af98f9", fontSize: "1.3rem", marginRight: "0.8rem" }} />
);
categoryIconsMap.set(
    TransactionCategory.HEALTHCARE,
    <Icon.MedicalServices style={{ color: "#fd6d6d", fontSize: "1.3rem", marginRight: "0.8rem" }} />
);
categoryIconsMap.set(
    TransactionCategory.LIVING_EXPENSES,
    <Icon.Home style={{ color: "#5a7ffa", fontSize: "1.3rem", marginRight: "0.8rem" }} />
);
categoryIconsMap.set(
    TransactionCategory.SHOPPING,
    <Icon.Clothes style={{ color: "#fe992b", fontSize: "1.3rem", marginRight: "0.8rem" }} />
);
categoryIconsMap.set(
    TransactionCategory.INCOME,
    <Icon.TrendingUp style={{ color: "#f7b7e5", fontSize: "1.3rem", marginRight: "0.8rem" }} />
);
categoryIconsMap.set(
    TransactionCategory.MISC,
    <Icon.MoreHoriz style={{ color: "#dce2e1", fontSize: "1.3rem", marginRight: "0.8rem" }} />
);

export { categoryIconsMap };
