import { Title } from "@trussworks/react-uswds";

const Spending: React.FC = () => {
  return (
    <div className="flex">
      {/* Mock Sidebar */}
      <div className="w-64 h-screen bg-red-500 fixed flex justify-center items-center">
        <h1 className="text-xl ml-2">Mock navbar, delete once created</h1>
      </div>
      <div className="flex-1 ml-64">
        <section className="overflow-auto h-screen">
          <Title className="ml-3">Spending Overview</Title> {/* Title for the page */}
          {/* Full-width row */}
          <div className="bg-blue-300 p-4 m-2 min-h-[30rem] rounded-md">
            <h2>Full Width Component</h2>
          </div>
          {/* Second row with two columns */}
          <div className="flex">
            <div className="flex-3 bg-green-300 p-4 m-2 min-h-[30rem] rounded-md">
              <h2>Large Pie Chart</h2>
            </div>
            <div className="flex-1 bg-yellow-300 p-4 m-2 rounded-md">
              <h2>Text or Info</h2>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Spending;
