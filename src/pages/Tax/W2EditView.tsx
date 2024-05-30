import { Button, StepIndicator, StepIndicatorStep } from "@trussworks/react-uswds";
import { useState } from "react";
import PersonalInfoStep from "./PersonalInfoStep";
import WwStep from "./w2Step";
import ReviewAndSubmitStepW2 from "./ReviewAndSubmitStepW2";
import FinancialInformationStepW2 from "./FinancialInformationStepW2";
import WithholdingsAndMiscW2 from "./WithholdingsAndMiscW2";



function W2EditView () {
    
    const [currentStep, setCurrentStep] = useState<number>(0); 
    interface Step {
        label: string;
        status?: 'complete' | 'current';
      }
    
    const [steps, setSteps] = useState<Step[]>([
        { label: 'Personal Information'},
        { label: 'Employer Information'},
        { label: 'Financial Information'},
        { label: 'Withholdings And Miscellaneous' },
        { label: 'Review and submit' },
      ]);
      const handleNextStep = () => {
        if (currentStep < steps.length - 1) {
            const updatedSteps = [...steps];
            updatedSteps[currentStep].status = 'complete'; // Mark current step as complete
            updatedSteps[currentStep + 1].status = 'current'; // Mark next step as current
            setSteps(updatedSteps);
            setCurrentStep((prevStep) => prevStep + 1);
        

        }

        };
    
    
        const handlePreviousStep = () => {
        if (currentStep > 0) {
            const updatedSteps = [...steps];
            updatedSteps[currentStep].status = undefined; // Remove current step status
            updatedSteps[currentStep - 1].status = 'current'; // Mark previous step as current
            setSteps(updatedSteps);
            setCurrentStep((prevStep) => prevStep - 1);
        }
    }

    return(
        <>
            <div className="flex flex-col items-center mt-5">
            <StepIndicator headingLevel="h4" ofText="of" stepText="Step" counters="default">
                {steps.map((step, index) => (
                <StepIndicatorStep
                    key={index}
                    label={step.label}
                    status={step.status}
                />
                ))}
            </StepIndicator>
                   
            
                    {/* Render current step content based on currentStep state */}
                    {/* You can conditionally render content for each step */}
                    <div className="bg-base-lightest  border-4 border-gray-300 shadow-lg ">
                        {currentStep === 0 && <PersonalInfoStep />}
                        {currentStep === 1 && <WwStep />}
                        {currentStep === 2 && <FinancialInformationStepW2 />}
                        {currentStep === 3 && <WithholdingsAndMiscW2 />}
                        {currentStep === 4 && <ReviewAndSubmitStepW2 />}
                        
                    </div>
                    <div className="flex ">
                    <Button type='button' onClick={handlePreviousStep} disabled={currentStep === 0}>
                    Prev
                    </Button>
                    <Button type='button' onClick={handleNextStep} disabled={currentStep === steps.length - 1}>
                    Next
                    </Button>
                    </div>
                </div>
        </>
    )

}

export default W2EditView;