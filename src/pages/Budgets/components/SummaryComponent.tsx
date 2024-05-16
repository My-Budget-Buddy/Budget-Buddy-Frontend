import { Gauge } from '@mui/x-charts/Gauge';

const SummaryComponent: React.FC = () => {
    return (
        <>
            <div className='flex flex-row justify-around w-6/12 border'>
                <div className='flex flex-col items-center justify-around'>
                    <div className='text-xl'>Total Available Funds Across Account</div>
                    <div className='text-xl text-green-600'>$amount</div>
                    <div>{'(accounts + projected earnings - reserved)'}</div>
                </div>

                <div className='flex flex-col items-center'>
                    <div className='text-xl'>Left to spend in May 2024</div>
                    <div className='border-red-500'>
                        <Gauge
                            width={150}
                            height={150}
                            value={75}
                            text='$2200/$3000'
                            startAngle={0}
                            endAngle={360}
                            innerRadius="80%"
                            outerRadius="100%"
                            // ...
                        />
                    </div>
                </div>
                
                <div className='flex flex-col justify-around'>
                    <div className='flex flex-col items-center'>
                        <div className='text-lg'>Total Spending Budget</div>
                        <div>$amount</div>
                    </div>
                    <div className='flex flex-col items-center'>
                        <div className='text-lg'>Allocated</div>
                        <div>$amount</div>
                    </div>
                    <div className='flex flex-col items-center'>
                        <div className='text-lg'>Remaining</div>
                        <div>$amount</div>
                    </div>
                </div>
            </div>
        </>   
    )
}

export default SummaryComponent