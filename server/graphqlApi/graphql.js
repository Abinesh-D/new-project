// graphql.js
const { gql } = require("apollo-server-express");
const axios = require("axios");
const qs = require("qs");
const xml2js = require("xml2js");
require("dotenv").config();

const CONSUMER_KEY = process.env.CLIENT_KEY;
const CONSUMER_SECRET = process.env.CLIENT_SECRET_KEY;

let cachedToken = null;
let tokenExpiry = null;

async function getAccessToken() {
  const now = Date.now();
  if (cachedToken && tokenExpiry && now < tokenExpiry) return cachedToken;

  const tokenUrl = "https://ops.epo.org/3.2/auth/accesstoken";
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");

  const headers = {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/x-www-form-urlencoded"
  };

  const data = qs.stringify({ grant_type: "client_credentials" });
  const response = await axios.post(tokenUrl, data, { headers });

  cachedToken = response.data.access_token;
  tokenExpiry = now + (18 * 60 * 1000) - 30 * 1000;
  return cachedToken;
}

function formatPatentNumberWithDot(patentNumber) {
  if (patentNumber.startsWith('WO20')) return patentNumber;
  if (patentNumber.startsWith('WO19')) {
    const indicesToRemove = [2, 3, 6];
    patentNumber = patentNumber.split('').filter((_, i) => !indicesToRemove.includes(i)).join('');
  } else if (patentNumber.startsWith('US') && patentNumber.length > 13) {
    patentNumber = patentNumber.split('').filter((_, i) => i !== 6).join('');
  }
  const regex = /^([A-Z]+\d+)([A-Z]+\d*)$/;
  const match = patentNumber.match(regex);
  return match ? `${match[1]}.${match[2]}` : patentNumber;
}

// 👉 GraphQL Schema Definition
const typeDefs = gql`
  type Query {
    getPatentData(patentNumber: String!): PatentResponse
  }

  type PatentResponse {
    patentNumber: String
    biblio: JSON
    familyData: JSON
  }

  scalar JSON
`;

// 👉 Resolver Logic
const resolvers = {
  Query: {
    getPatentData: async (_, { patentNumber }) => {
      if (!patentNumber) throw new Error("Patent number is required");

      const formatted = formatPatentNumberWithDot(patentNumber);
      const token = await getAccessToken();

      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: "application/xml"
      };

      const familyUrl = `https://ops.epo.org/3.2/rest-services/family/publication/docdb/${formatted}`;
      const biblioUrl = `https://ops.epo.org/3.2/rest-services/published-data/publication/docdb/${formatted}/biblio`;

      const [biblioResponse, familyResponse] = await Promise.all([
        axios.get(biblioUrl, { headers }),
        axios.get(familyUrl, { headers })
      ]);

      const parser = new xml2js.Parser({ explicitArray: false, tagNameProcessors: [xml2js.processors.stripPrefix] });
      const biblio = await parser.parseStringPromise(biblioResponse.data);
      const familyData = await parser.parseStringPromise(familyResponse.data);

      return { patentNumber, biblio, familyData };
    }
  }
};

module.exports = { typeDefs, resolvers };
