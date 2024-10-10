import { useEffect, useState } from "react";
//import { useTranslation } from "react-i18next";
import UsIcon from "/icons/country-usa.svg";
import StateIcon from "/icons/state-california.svg";
import { formatCurrency } from "../../utils/helpers";
import Confetti from "react-confetti";
import { getCurrentRefundAPI } from "../../api/taxesAPI";
import { useParams } from "react-router-dom";

// const mockRefunds = {
//     federalRefund: 1253,
//     stateRefund: 283
// };

const TaxResults: React.FC = () => {
    const { returnId } = useParams();
    console.log(returnId);
    //const { t } = useTranslation();
    const [numConfetti, setNumConfetti] = useState(0);
    const [taxRefunds, setTaxRefunds] = useState({
        federalRefund: 0,
        stateRefund: 0
    });

    useEffect(() => {
        // pull tax refund data here
        // const refunds = INSERT GET REQUEST HERE (need current tax return id)
        getCurrentRefundAPI(returnId)
            .then((res) => {
                setTaxRefunds(res.data); // set to refunds
                if (res.data.federalRefund + res.data.stateRefund >= 0) {
                    setNumConfetti(200);
                }
            })

    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setNumConfetti(0);
        }, 5000); // Stop confetti after 5 seconds
        return () => clearTimeout(timer);
    }, []);

    const positiveRefundTotal = taxRefunds.federalRefund + taxRefunds.stateRefund >= 0;

    return (
        <>
            {<Confetti numberOfPieces={numConfetti} />}

            <div className="flex flex-col items-center w-full h-full justify-center">
                <div className="text-6xl font-bold mb-20">Congratulations on filing your tax returns!</div>
                <div className="flex items-center border-gray-300 border-4 shadow-md w-3/4 h-1/2">
                    <div className="w-1/2 h-full flex flex-col items-center">
                        <div className="w-3/4 h-1/2 border-b-2 border-gray-300 flex flex-col justify-evenly">
                            <div className="flex justify-between">
                                <div className="text-xl">Federal refund</div>
                                <div className="text-xl">{formatCurrency(taxRefunds.federalRefund)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div className="text-xl">State refund</div>
                                <div className="text-xl">{formatCurrency(taxRefunds.stateRefund)}</div>
                            </div>
                        </div>

                        <div className="h-1/2 flex flex-col justify-evenly items-center">
                            <div className="text-2xl font-bold">Your total refund</div>
                            <div
                                className={`text-6xl font-bold ${positiveRefundTotal ? "text-green-600" : "text-red-600"
                                    }`}
                            >
                                {formatCurrency(taxRefunds.federalRefund + taxRefunds.stateRefund)}
                            </div>
                        </div>
                    </div>

                    <div className="w-1/2 h-full flex flex-col items-center justify-evenly">
                        <div className="w-11/12 h-2/5 rounded bg-gray-100 flex ">
                            <div className="w-2/5 flex justify-center items-center">
                                <img src={UsIcon} alt="US Icon" className="h-full mt-5" />
                            </div>
                            <div className="w-3/5 flex flex-col justify-evenly">
                                <div className="text-2xl">Filed Federal Tax Return</div>
                                <div className="text-lg">
                                    Filed with: <span className="font-bold">Budget Buddy</span>
                                </div>
                                <div className="text-lg">
                                    Return Status: <span className="font-bold">Accepted</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-11/12 h-2/5 rounded bg-gray-100 flex ">
                            <div className="w-2/5 flex justify-center items-center">
                                <img src={StateIcon} alt="State Icon" className="h-full mt-5" />
                            </div>
                            <div className="w-3/5 flex flex-col justify-evenly">
                                <div className="text-2xl">Filed State Tax Return</div>
                                <div className="text-lg">
                                    Filed with: <span className="font-bold">Budget Buddy</span>
                                </div>
                                <div className="text-lg">
                                    Return Status: <span className="font-bold">Accepted</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TaxResults;
