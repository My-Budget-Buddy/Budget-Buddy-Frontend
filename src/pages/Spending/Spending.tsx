import { Title } from "@trussworks/react-uswds";
import { PieChart } from "@mui/x-charts";

const data = [
  {
    data: [
      { id: 0, value: 10, label: "series A" },
      { id: 1, value: 15, label: "series B" },
      { id: 2, value: 20, label: "series C" },
    ],
  },
];

const Spending: React.FC = () => {
  return (
    <div className="min-w-screen">
      <div className="flex-1">
        <section className=" h-screen">
          <Title className="ml-3">Spending Overview</Title>{" "}
          {/* Title for the page */}
          {/* Full-width row */}
          <div className="bg-blue-300 p-4 m-2 min-h-[30rem] rounded-md flex justify-center items-center">
            <h2>Full Width Component</h2>
            {/* More content here */}
          </div>
          {/* Second row with two columns */}
          <div className="flex">
            <div className="flex justify-center items-center flex-3 bg-green-300 p-4 m-2 min-h-[30rem] rounded-md ">
              <PieChart series={data} width={600} height={300} />
            </div>
            <div className="flex justify-center items-center flex-1 bg-yellow-300 p-4 m-2 rounded-md">
              <h2>Text or Info</h2>
              {/* More content here */}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Spending;
