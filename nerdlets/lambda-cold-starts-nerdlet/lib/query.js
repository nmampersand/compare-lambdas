/*
  Retrieve accounts the user has access to
*/
export const GET_ACCOUNTS = `
query {
  actor {
    accounts {
      id
      name
    }
  }
}
`;

/*
  Retrieve a list of lambda functions which are reporting
*/
export const GET_REPORTING_LAMBDAS = `
query {
  actor {
    entitySearch(queryBuilder: {
      infrastructureIntegrationType: AWS_LAMBDA_FUNCTION, 
      reporting: true
    }) {
      results {
        entities {
          ... on InfrastructureAwsLambdaFunctionEntityOutline {
            guid
            name
            accountId
          }
        }
      }
    }
  }
}
`;

/*
  Query the ratio of lambda invocations with cold starts vs without cold starts
*/
export const GET_LAMBDA_COLD_START_RATIO =
  "SELECT count(*) AS 'Invocations' FROM AwsLambdaInvocation " +
  "FACET CASES (WHERE aws.lambda.coldStart IS NOT NULL AS 'With Cold Start', " +
  "WHERE aws.lambda.coldStart IS NULL AS 'Without Cold Start') ";
