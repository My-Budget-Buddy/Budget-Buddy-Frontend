import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import { Gauge, gaugeClasses } from "@mui/x-charts";
import { useAuthentication } from "../../contexts/AuthenticationContext";
import { Modal, ModalRef, ButtonGroup, ModalFooter, ModalHeading, ModalToggleButton } from "@trussworks/react-uswds";

interface CreditScoreModalProps {
    totalDebt: number;
}

const CreditScoreModal: React.FC<CreditScoreModalProps> = ({ totalDebt }) => {
    const { t } = useTranslation();
    const { jwt } = useAuthentication();

    const modalRef = useRef<ModalRef>(null);

    const [creditColor, setCreditColor] = useState<string | null>(null);

    // returns the color of the gauge based on the credit score
    const getCreditColor = (creditScore: number): string => {
        if (creditScore > 719) return "#52b202";
        else if (creditScore > 689) return "#90EE90";
        else if (creditScore > 629) return "#FFA500";
        else return "#b20202";
    };

    const creditScore = useMemo(() => {
        if (!jwt) return 0;

        const initialScore = 571;
        let score = 300;
        if (totalDebt > 50000) {
            score -= (totalDebt - 50000) / 1000;
        }

        score = Math.max(score, 0);
        let res = initialScore + score;

        // Limit the maximum value of res to 850
        res = Math.min(res, 850);

        setCreditColor(getCreditColor(res));

        return res;
    }, [totalDebt, jwt]);

    return (
        <>
            <div>
                <ModalToggleButton modalRef={modalRef} opener>
                    {t("accounts.get-report")}
                </ModalToggleButton>
                <Modal
                    ref={modalRef}
                    id="credit-score-modal"
                    aria-labelledby="credit-score-modal-heading"
                    aria-describedby="credit-score-modal-description"
                    className="w-[1600px]"
                >
                    <ModalHeading id="credit-score-modal-heading" className="pb-4">
                        {t("accounts.credit-score-report")}
                    </ModalHeading>
                    <div className="flex justify-center items-center h-full py-4">
                        <Gauge
                            width={400}
                            height={200}
                            value={creditScore} // creditScore
                            valueMin={300}
                            valueMax={850}
                            startAngle={-90}
                            endAngle={90}
                            sx={{
                                [`& .${gaugeClasses.valueText}`]: {
                                    fontSize: "40px", // Adjust the font size // Change the color to blue
                                    fontWeight: "bold", // Make the text bold
                                    transform: "translate(0px, -15px)" // Adjust position if needed
                                },
                                [`& .${gaugeClasses.valueArc}`]: {
                                    fill: creditColor
                                }
                            }}
                            text={({ value }) => `${value}`}
                        />
                    </div>
                    <ModalFooter>
                        <ButtonGroup>
                            <ModalToggleButton modalRef={modalRef} closer unstyled className="padding-105 text-center">
                                {t("accounts.back")}
                            </ModalToggleButton>
                        </ButtonGroup>
                    </ModalFooter>
                </Modal>
            </div>
        </>
    );
};

export default CreditScoreModal;
