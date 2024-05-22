import { useDispatch, useSelector } from 'react-redux';
import taxImage from './tax-report-icon-free-vector.jpg'
import { createTaxReturn } from './taxesAPI';
import { RootState } from '../../util/redux/store';
import { setTaxReturnInfo } from './TaxReturnSlice';
import { useNavigate } from 'react-router-dom';

const TaxNav: React.FC = () => {

    interface initReturn {
      year : number,
      userId : number
      };
    const taxReturnInfo = useSelector((state:RootState) => state.taxReturn);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const starterblock : initReturn = {
      year : 2024,
      userId : 1
    }
    
    const containerStyle: React.CSSProperties = {
        textAlign: 'center',
        margin: '20px',
      };
    
      const iconsContainerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-around',
        backgroundColor: '#f0f0f0',
        padding: '20px',
        borderRadius: '8px',
      };
    
      const toolStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      };
    
      const iconButtonStyle: React.CSSProperties = {
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
      };
    
      const iconStyle: React.CSSProperties = {
        width: '50px',
        height: '50px',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        marginBottom: '10px',
      };
    
      const labelStyle: React.CSSProperties = {
        fontSize: '14px',
        color: '#333',
      };
    
      const handleIconClick = (action: string) => {
        console.log(action);
        if (action === "File Taxes"){
          createTaxReturn(starterblock)
          .then(res => {
            console.log(res);
            dispatch(setTaxReturnInfo(res.data));
            navigate(`/dashboard/tax/${res.data.id}`)
          })
          .catch(err => {
            console.log("Error: Could not create new tax return");
          })
        }
        // Implement the action you want on click here
        // For example, navigate to a different page, show a modal, etc.
      };
    
      return (
        <div style={containerStyle}>
          <div style={iconsContainerStyle}>
            <div style={toolStyle}>
              <button
                style={iconButtonStyle}
                onClick={() => handleIconClick('File Taxes')}
              >
                <div
                  style={{ ...iconStyle, backgroundImage: `url(${taxImage})` }}
                ></div>
              </button>
              <div style={labelStyle}>File Taxes</div>
            </div>
            <div style={toolStyle}>
              <button
                style={iconButtonStyle}
                onClick={() => handleIconClick('Estimate Refund')}
              >
                <div
                  style={{
                    ...iconStyle,
                    backgroundImage: `url(${taxImage})`,
                  }}
                ></div>
              </button>
              <div style={labelStyle}>Estimate Refund</div>
            </div>
            <div style={toolStyle}>
              <button
                style={iconButtonStyle}
                onClick={() => handleIconClick('Document Checklist')}
              >
                <div
                  style={{
                    ...iconStyle,
                    backgroundImage: `url(${taxImage})`,
                  }}
                ></div>
              </button>
              <div style={labelStyle}>Document Checklist</div>
            </div>
            <div style={toolStyle}>
              <button
                style={iconButtonStyle}
                onClick={() => handleIconClick('Refund Planning')}
              >
                <div
                  style={{
                    ...iconStyle,
                    backgroundImage: `url(${taxImage})`,
                  }}
                ></div>
              </button>
              <div style={labelStyle}>Refund Planning</div>
            </div>
          </div>
        </div>
      );
    };

export default TaxNav;

