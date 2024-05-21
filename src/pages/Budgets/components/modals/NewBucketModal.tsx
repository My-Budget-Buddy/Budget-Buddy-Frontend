import {
    Button,
    ButtonGroup,
    Modal,
    ModalFooter,
    ModalHeading,
    ModalRef,
    ModalToggleButton,
    TextInput
} from "@trussworks/react-uswds";
import React, { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../util/redux/hooks";
import { setIsSending } from "../../../../util/redux/simpleSubmissionSlice";
import { timedDelay } from "../../../../util/util";
import { SavingsBucketRowProps } from "../../../../types/budgetInterfaces";

interface NewBucketModalProps {
    children: React.ReactNode;
}

interface RawBucketToSend {
    // bucketId: number;
    userId: number;
    bucketName: string;
    amountAvailable: number;
    amountRequired: number;
    // dateCreated: string;
    isActive: boolean;
    isReserved: boolean;
    // monthYear: string;
}

async function postBucket(bucket: RawBucketToSend): Promise<RawBucketToSend> {
    const endpoint = `${import.meta.env.VITE_ENDPOINT_URL}/buckets/add`;

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bucket)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data: RawBucketToSend = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to create bucket:", error);
        throw error;
    }
}

const NewBucketModal: React.FC<NewBucketModalProps> = ({ children }) => {
    const [formData, setFormData] = useState<SavingsBucketRowProps>({
        data: {
            id: 0,
            name: "",
            amount_required: 0,
            amount_reserved: 0,
            is_currently_reserved: false
        }
    });

    const dispatch = useAppDispatch();
    const isSending = useAppSelector((state) => state.simpleFormStatus.isSending);
    const modalRef = useRef<ModalRef>(null);

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Nested data interface is useful to keep simple top level component declarations, but leads to this.
        setFormData((prevState) => ({
            ...prevState,
            data: {
                ...prevState.data,
                [name]: value
            }
        }));
    };

    async function sendNewBucket(bucket: SavingsBucketRowProps) {
        const newBucket = {
            // bucketId: 6,
            userId: 1, //TODO Try to have backend team use credentials for this field instead of passing it in body
            bucketName: formData.data.name,
            amountAvailable: 0, //TODO rename as amountReserved
            amountRequired: formData.data.amount_required,
            // dateCreated: "2024-05-21T08:39:46.726429",
            isActive: true,
            isReserved: false
            // monthYear: "2024-06"
        };

        // Sets buttons to 'waiting', prevent closing
        dispatch(setIsSending(true));

        console.log("SENDING BUCKET...");

        try {
            await postBucket(newBucket);
        } catch {
            console.error("ERROR!");
        }

        console.log("BUCKET SENT: ", bucket);

        // Reallow all user input again
        dispatch(setIsSending(false));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await sendNewBucket(formData);
        modalRef.current?.toggleModal();
    }

    return (
        <div>
            <ModalToggleButton modalRef={modalRef} opener>
                {children}
            </ModalToggleButton>

            <Modal
                ref={modalRef}
                id="example-modal-1"
                aria-labelledby="modal-1-heading"
                aria-describedby="modal-1-description"
            >
                <ModalHeading id="modal-1-heading">Add new savings bucket</ModalHeading>
                <div>
                    <TextInput
                        type="text"
                        name="name"
                        value={formData.data.name}
                        onChange={handleChangeInput}
                        placeholder="Name"
                        id={""}
                    />
                    <TextInput
                        type="number"
                        name="amount_required"
                        value={formData.data.amount_required}
                        onChange={handleChangeInput}
                        placeholder="Amount"
                        id={""}
                    />
                </div>

                <ModalFooter>
                    <ButtonGroup>
                        <Button onClick={handleSubmit} disabled={isSending} type={"button"}>
                            Save new bucket
                        </Button>
                        <ModalToggleButton modalRef={modalRef} closer unstyled className="padding-105 text-center">
                            Go back
                        </ModalToggleButton>
                    </ButtonGroup>
                </ModalFooter>
            </Modal>

            {/* <Button onClick={action}>Add new savings bucket</Button> */}
        </div>
    );
};

export default NewBucketModal;
