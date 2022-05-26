import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.scala.{DefaultScalaModule, ScalaObjectMapper}

import scala.io.Source

object GraphQueryExtract {

        def getQuery(queryType: String): String = {
                val json = Desearlise()
                json.operations.find(_.document.contains(queryType)).get.document
        }

        case class Operations(signature: String, document: String, metadata: Map[String,String])
        case class Desearlise(version: String, operations: Seq[Operations])

        object Desearlise {
                def apply(): Desearlise = {
                        val objectMapper = new ObjectMapper() with ScalaObjectMapper
                        objectMapper.registerModule(DefaultScalaModule)
                        val str = Source.fromFile("data/kraken/graphql-queries.json").mkString
                        objectMapper.readValue[Desearlise](str)
                }
        }
}
