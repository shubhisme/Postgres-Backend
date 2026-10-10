const URL =
  "http://127.0.0.1:5001/api/v1/users/54b41637-f93d-4356-919d-6093112a1f75";

const concurrunt_req = 20;

async function makeRequest(index: number) {
  const start = performance.now();

  const response = await fetch(URL, {
    headers: {
      Cookie: `session=oD5zZGxeWQkmCgwmMnHdp9Gpdck3HB_Zp49nwmwvy0w`,
    },
  });

  const duration = performance.now() - start;

  console.log(
    `Request  ${index} : ${response.status}  -  ${duration.toFixed(2)}ms`,
  );
}

async function main() {
  console.log(`Sending ${concurrunt_req} concurrent requests .... `);

  await Promise.all(
    Array.from({ length: concurrunt_req }, (_, index) =>
      makeRequest(index + 1),
    ),
  );
}

main();