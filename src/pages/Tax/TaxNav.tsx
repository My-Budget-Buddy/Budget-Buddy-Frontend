import taxImage from './tax-report-icon-free-vector.jpg'

const TaxNav: React.FC = () => {
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

