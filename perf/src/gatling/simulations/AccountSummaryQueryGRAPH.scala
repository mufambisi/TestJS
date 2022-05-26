import au.com.origin.gatling.common._
import io.gatling.core.Predef._
import io.gatling.http.Predef._

 class AccountSummaryQueryGRAPH extends BaseSim {

  private val graphUrl = s"${envProps("environment-url")}/v1/graphql/"
  private val inputFeedjwt = csv("build/data/data_feed_jwt.csv").circular
  private val operation = "AccountSummaryQuery"

   val query = GraphQueryExtract.getQuery(operation)

 private val scn =
    scenario(SimulationName)
     .feed(inputFeedjwt)
      .exec(
        http(SimulationName)
          .post(graphUrl)
          .header("Accept", "application/json")
          .header("Content-Type", "application/json")
          .header("Authorization", "Bearer ${jwt}")
          .body(StringBody(
            s"""{
              |    "operationName": "${operation}",
              |    "variables": {
              |        "accountNumber": "$${accountNumber}",
              |       "paymentForcastToDate": "2022-01-01"
              |    },
              |    "query": "${query}"
              |}""".stripMargin))
          .check(status.is(200))
          .check(jsonPath("$..number").is("${accountNumber}"))
          .check(jsonPath("$..billingOptions").exists)
          .check(jsonPath("$..firstBill").exists)
          .check(jsonPath("$..pendingPayments").exists)
          .check(jsonPath("$..agreements").exists)
      )

  setUp(
    injectLoad(scn)
  ) assertions (
    checkOK(SimulationName)
    )
}

