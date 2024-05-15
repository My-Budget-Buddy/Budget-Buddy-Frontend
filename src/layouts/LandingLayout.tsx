import {Outlet} from "react-router-dom";

const LandingLayout: React.FC = () => {
    return(
        <div className='layout-container'>
            {/*<HeaderComponent />*/}
            <main className='main-content'>
                <Outlet />
            </main>
            {/*<FooterComponent/>*/}
        </div>
    )
}

export default LandingLayout;