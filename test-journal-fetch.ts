import { client } from "./tina/__generated__/client";

async function testJournalFetch() {
  try {
    console.log("Fetching journals...");
    const journalList = await client.queries.journalConnection({
      filter: {
        published: {
          eq: true
        }
      }
    });
    console.log("Total journals:", journalList.data.journalConnection.totalCount);
    console.log("Journals:", JSON.stringify(journalList.data.journalConnection.edges, null, 2));
  } catch (error) {
    console.error("Error fetching journals:", error);
  }
}

testJournalFetch();
EOF < /dev/null