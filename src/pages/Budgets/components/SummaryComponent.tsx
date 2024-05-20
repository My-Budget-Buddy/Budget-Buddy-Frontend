
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';


const SummaryComponent: React.FC = () => {
    return (
        <>

            <div className='flex flex-row justify-between w-full'>
                <div className='flex flex-col items-center justify-around'>
                    <div className='text-2xl font-bold'>Total Available Funds Across Account</div>
                    <div className=' text-6xl text-green-600 font-bold'>$amount</div>

                    <div>{'(accounts + projected earnings - reserved)'}</div>
                </div>

                <div className='flex flex-col items-center'>

                    <div className='text-2xl mt-4 font-bold'>Left to spend in May 2024</div>
                    <Gauge
                        width={400}
                        height={200}
                        value={75}
                        text='$2200'
                        startAngle={-90}
                        endAngle={90}
                        innerRadius="80%"
                        outerRadius="100%"
                        sx={{
                            [`& .${gaugeClasses.valueText}`]: {
                              fontSize: 40,
                              transform: 'translate(0px, -20px)',
                            },
                          }}
                        // ...
                    />
                    <div className='bg-slate-200 p-1 px-2 rounded-lg font-bold'>of $3500</div>

                </div>
                
                <div className='flex flex-col justify-around'>
                    <div className='flex flex-col items-center'>

                        <div className='text-2xl font-bold'>Total Spending Budget</div>
                        <div className='text-lg'>$amount</div>
                    </div>
                    <div className='flex flex-col items-center'>
                        <div className='text-2xl font-bold'>Allocated</div>
                        <div className='text-lg'>$amount</div>
                    </div>
                    <div className='flex flex-col items-center'>
                        <div className='text-2xl font-bold'>Remaining</div>
                        <div className='text-lg'>$amount</div>

                    </div>
                </div>
            </div>
        </>   
    )
}

export default SummaryComponent