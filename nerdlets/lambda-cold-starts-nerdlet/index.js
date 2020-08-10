import React, { PureComponent } from 'react';
import {
  PlatformStateContext,
  NerdGraphQuery,
  Spinner,
  HeadingText,
  Grid,
  GridItem,
  Stack,
  StackItem,
  Select,
  SelectItem,
  PieChart,
} from 'nr1';
import { timeRangeToNrql } from '@newrelic/nr1-community';
import {
  GET_REPORTING_LAMBDAS,
  GET_ACCOUNTS,
  GET_LAMBDA_COLD_START_RATIO,
} from './lib/query';

/**
 * Displays pie charts representing the percentage of lambda invocations
 * which have a cold start vs those which do not.
 */
export default class LambdaColdStarts extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      accounts: null,
      selectedAccount: null,
      lambdas: null,
      error: null,
    };
  }

  componentDidMount() {
    // Retrieve accounts for the current user
    NerdGraphQuery.query({ query: GET_ACCOUNTS })
      .then(({ data }) => {
        const accounts = data.actor.accounts;
        // Select the first account as the default to display
        const account = accounts.length > 0 && accounts[0];
        this.setState({ selectedAccount: account, accounts });
        // Fetch all lambdas
        this.fetchLambdas(account.id);
      })
      .catch((error) => {
        this.setState({ error });
      });
  }

  /**
   * Sets the selectedAccount to a new account the user has access to
   */
  selectAccount = (_, value) => {
    this.setState({ selectedAccount: value });
  };

  /**
   * Fetches all lambda functions which are reporting
   */
  fetchLambdas = () => {
    // Retrieve all lambda entities currently reporting
    NerdGraphQuery.query({ query: GET_REPORTING_LAMBDAS })
      .then(({ data }) => {
        const lambdas = data.actor.entitySearch.results.entities;
        this.setState({ lambdas });
      })
      .catch((error) => {
        this.setState({ error });
      });
  };

  render() {
    const { selectedAccount, accounts, lambdas, error } = this.state;

    if (error) return <HeadingText>{error}</HeadingText>;
    // Wait for a selected account and a list of lambdas to report on
    if (!selectedAccount || !lambdas) return <Spinner />;

    return (
      selectedAccount && (
        <Stack
          fullWidth
          horizontalType={Stack.HORIZONTAL_TYPE.FILL}
          directionType={Stack.DIRECTION_TYPE.VERTICAL}
        >
          <StackItem>
            <Select value={selectedAccount} onChange={this.selectAccount}>
              {accounts.map((account) => {
                return (
                  <SelectItem key={account.id} value={account}>
                    {account.name}
                  </SelectItem>
                );
              })}
            </Select>
          </StackItem>

          <StackItem>
            <PlatformStateContext.Consumer>
              {(PlatformState) => {
                const sinceQuery = timeRangeToNrql(PlatformState);
                return (
                  <main>
                    <Grid>
                      <GridItem columnSpan={12}>
                        <HeadingText
                          spacingType={[HeadingText.SPACING_TYPE.LARGE]}
                          type={HeadingText.TYPE.HEADING_3}
                        >
                          All lambdas
                        </HeadingText>
                        <PieChart
                          accountId={selectedAccount.id}
                          query={GET_LAMBDA_COLD_START_RATIO + sinceQuery}
                          fullWidth
                        />
                      </GridItem>
                      <GridItem columnSpan={12}>
                        <HeadingText
                          spacingType={[HeadingText.SPACING_TYPE.LARGE]}
                          type={HeadingText.TYPE.HEADING_3}
                        >
                          By lambda
                        </HeadingText>
                      </GridItem>
                      {lambdas.map((lambda) => {
                        const guidQuery = `WHERE (\`entityGuid\`='${lambda.guid}') `;
                        return (
                          // only display lambdas for the current selected account
                          lambda.accountId === selectedAccount.id && (
                            <GridItem key={lambdas.guid} columnSpan={6}>
                              <HeadingText
                                spacingType={[HeadingText.SPACING_TYPE.MEDIUM]}
                                type={HeadingText.TYPE.HEADING_4}
                              >
                                {lambda.name}
                              </HeadingText>
                              <PieChart
                                accountId={selectedAccount.id}
                                query={
                                  GET_LAMBDA_COLD_START_RATIO +
                                  guidQuery +
                                  sinceQuery
                                }
                                fullWidth
                              />
                            </GridItem>
                          )
                        );
                      })}
                    </Grid>
                  </main>
                );
              }}
            </PlatformStateContext.Consumer>
          </StackItem>
        </Stack>
      )
    );
  }
}
