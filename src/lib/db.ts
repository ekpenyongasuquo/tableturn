import { DsqlSigner } from "@aws-sdk/dsql-signer";
import postgres from "postgres";

const endpoint = process.env.DSQL_CLUSTER_ENDPOINT!;
const region = process.env.DSQL_REGION!;

async function getToken() {
  const signer = new DsqlSigner({ hostname: endpoint, region });
  return await signer.getDbConnectAdminAuthToken();
}

let sql: ReturnType<typeof postgres> | null = null;

export async function getDb() {
  if (sql) return sql;
  const token = await getToken();
  sql = postgres({
    host: endpoint,
    port: 5432,
    database: "postgres",
    username: "admin",
    password: token,
    ssl: { rejectUnauthorized: false },
    max: 10,
  });
  return sql;
}