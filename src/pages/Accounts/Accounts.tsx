import { Accordion, Grid, GridContainer, Icon } from "@trussworks/react-uswds";

import AccountModal from "./AccountModal";

const Accounts: React.FC = () => {
  return (
    <>
      <h1>Accounts</h1>
      <div className="flex justify-end">
        <AccountModal />
      </div>

      <div className="py-5">
        <Accordion
          bordered={false}
          multiselectable={true}
          items={[
            {
              title: (
                <div className="flex justify-between">
                  <p>
                    <Icon.AccountBalance /> Checking
                  </p>
                </div>
              ),
              content: (
                <div>
                  <GridContainer>
                    <Grid row>
                      <Grid
                        tablet={{
                          col: 2,
                        }}
                      >
                        {<p>TD Bank</p>}
                      </Grid>
                      <Grid
                        className="flex justify-start"
                        tablet={{
                          col: 4,
                        }}
                      >
                        {<p>0001</p>}
                      </Grid>
                      <Grid
                        className="flex justify-end"
                        tablet={{
                          col: 6,
                        }}
                      >
                        {<p>$5,000</p>}
                      </Grid>
                    </Grid>
                  </GridContainer>
                </div>
              ),
              expanded: false,
              id: "Checking",
              headingLevel: "h4",
            },
            {
              title: (
                <div className="flex justify-between">
                  <p>
                    <Icon.CreditCard /> Credit Cards
                  </p>
                </div>
              ),
              content: (
                <div>
                  <GridContainer>
                    <Grid row>
                      <Grid
                        tablet={{
                          col: 2,
                        }}
                      >
                        {<p>Visa</p>}
                      </Grid>
                      <Grid
                        className="flex justify-start"
                        tablet={{
                          col: 4,
                        }}
                      >
                        {<p>5000</p>}
                      </Grid>
                      <Grid
                        className="flex justify-end"
                        tablet={{
                          col: 6,
                        }}
                      >
                        {<p>$2,310</p>}
                      </Grid>
                    </Grid>
                  </GridContainer>
                </div>
              ),
              expanded: false,
              id: "credit-cards",
              headingLevel: "h4",
            },
            {
              title: (
                <div className="flex justify-between">
                  <p>
                    <Icon.AccountBalance /> Net Cash
                  </p>
                </div>
              ),
              content: (
                <div>
                  <GridContainer>
                    <Grid row>
                      <Grid
                        tablet={{
                          col: 2,
                        }}
                      >
                        {<p>TD Bank</p>}
                      </Grid>
                      <Grid
                        className="flex justify-start"
                        tablet={{
                          col: 4,
                        }}
                      >
                        {<p>0001</p>}
                      </Grid>
                      <Grid
                        className="flex justify-end"
                        tablet={{
                          col: 6,
                        }}
                      >
                        {<p>$5,000</p>}
                      </Grid>
                    </Grid>
                  </GridContainer>
                </div>
              ),
              expanded: false,
              id: "net-cash",
              headingLevel: "h4",
            },
            {
              title: (
                <div className="flex justify-between">
                  <p>
                    <Icon.AccountBalance /> Savings
                  </p>
                </div>
              ),
              content: (
                <div>
                  <GridContainer>
                    <Grid row>
                      <Grid
                        tablet={{
                          col: 2,
                        }}
                      >
                        {<p>TD Bank</p>}
                      </Grid>
                      <Grid
                        className="flex justify-start"
                        tablet={{
                          col: 4,
                        }}
                      >
                        {<p>0009</p>}
                      </Grid>
                      <Grid
                        className="flex justify-end"
                        tablet={{
                          col: 6,
                        }}
                      >
                        {<p>$10,000</p>}
                      </Grid>
                    </Grid>
                  </GridContainer>
                </div>
              ),
              expanded: false,
              id: "savings",
              headingLevel: "h4",
            },
            {
              title: (
                <div className="flex justify-between">
                  <p>
                    <Icon.AccountBalance /> investments
                  </p>
                </div>
              ),
              content: (
                <div>
                  <GridContainer>
                    <Grid row>
                      <Grid
                        tablet={{
                          col: 2,
                        }}
                      >
                        {<p>Stocks</p>}
                      </Grid>
                      <Grid
                        className="flex justify-start"
                        tablet={{
                          col: 4,
                        }}
                      >
                        {<p>0060</p>}
                      </Grid>
                      <Grid
                        className="flex justify-end"
                        tablet={{
                          col: 6,
                        }}
                      >
                        {<p>$2,000</p>}
                      </Grid>
                    </Grid>
                  </GridContainer>
                </div>
              ),
              expanded: false,
              id: "investments",
              headingLevel: "h4",
            },
          ]}
        />
      </div>
    </>
  );
};

export default Accounts;
