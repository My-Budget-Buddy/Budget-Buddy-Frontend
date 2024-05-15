import {Outlet} from "react-router-dom";

const AppLayout: React.FC = () => {
    return(
        <div className='layout-container'>
            {/*<SideNavBar />*/}
            <main className='main-content'>
                <Outlet />
            </main>

        </div>
    )
}

export default AppLayout;