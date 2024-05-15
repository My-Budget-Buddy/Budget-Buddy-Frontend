export interface SavingsBucketRowProps {
    data: {
      name: string;
      amount_required: number;
      amount_reserved: number;
      is_currently_reserved: boolean;
      category: string;
      // Add more fields as needed
    };
  }