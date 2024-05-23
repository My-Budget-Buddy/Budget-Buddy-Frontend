import { Gauge, gaugeClasses } from "@mui/x-charts";
import {
    Modal,
    ModalRef,
    ButtonGroup,
    ModalFooter,
    ModalHeading,
    ModalToggleButton,
    Alert,
} from "@trussworks/react-uswds";
import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { useRef } from "react";

interface CreditScoreModalProps {
    totalDebt: number;
}

const CreditScoreModal: React.FC<CreditScoreModalProps> = ({ totalDebt }) => {
    const modalRef = useRef<ModalRef>(null);
    const [error, setError] = useState<string | null>(null);
    const [creditColor, setCreditColor] = useState<string | null>(null);
    const [creditScore, setCreditScore] = useState<number>(0);

    const url = "http://localhost:8125/api/credit/score/1"

    // returns the color of the gauge based on the credit score
    const getCreditColor = (creditScore: number): string => {
        if (creditScore > 719)
            return "#52b202";
        else if (creditScore > 689)
            return "#90EE90";
        else if (creditScore > 629)
            return "#FFA500";
        else
            return "#b20202";
    }

    useEffect(() => {
        // TODO: update this to use the users information + the gateway service + headers for Auth
        fetch(url)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Error fetching credit score information");
                }
                return res.json();
            })
            .then((data: { creditScore: number }) => setCreditScore(data.creditScore))
            .catch((err: Error) => setError(err.message));
    }, []);

    useEffect(() => {
        let score = 300;
        if (totalDebt > 50000) {
            score -= (totalDebt - 50000) / 1000;
        }
        score = Math.max(score, 0);

        // Increase creditScore by score
        setCreditScore(prevCreditScore => prevCreditScore + score);
    }, [totalDebt]);
    // sets the color of the gauge based on the credit score
    useEffect(() => {
        setCreditColor(getCreditColor(creditScore));
    }, [creditScore]);


    return (
        <>
            <div>
                <ModalToggleButton modalRef={modalRef} opener>
                    Get Report
                </ModalToggleButton>
                <Modal
                    ref={modalRef}
                    id="credit-score-modal"
                    aria-labelledby="credit-score-modal-heading"
                    aria-describedby="credit-score-modal-description"
                    className="w-[1600px]"
                >
                    <ModalHeading id="credit-score-modal-heading" className="pb-4">
                        Credit Score Report
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
                            <ModalToggleButton
                                modalRef={modalRef}
                                closer
                                unstyled
                                className="padding-105 text-center"
                            >
                                Go back
                            </ModalToggleButton>
                        </ButtonGroup>
                    </ModalFooter>
                </Modal>
            </div>
        </>
    );
};

export default CreditScoreModal;
