import au.com.origin.gatling.common._
import io.gatling.core.Predef._
import java.io.File

class FetchAuth0Token extends BaseSim {
  
  private val clientId = envVar("MY_ACCOUNT_CLIENT_ID")
  private val inputFeed = csv(s"data/data_feed_auth0_usr_${envProps("environment")}.csv").circular
  private val outputCSV = new File("build/data/data_feed_jwt.csv")

  private val scn =
    scenario(SimulationName)
      .feed(inputFeed)
      .exec(
        TokenAPIs.fetchAuth0Token(SimulationName, clientId, "${userEmail}", "${userPassword}")
      )
      .exec( session => {
        val (names, values) = toCSV("accountNumber,jwt,") { col =>
          session(col).as[String]
        }
        writeDataRecord(outputCSV, names, values)
        session
      })

  setUp(
    prepareData(scn)
  ) assertions (
    checkPartiallyOK(SimulationName)
  )
}

