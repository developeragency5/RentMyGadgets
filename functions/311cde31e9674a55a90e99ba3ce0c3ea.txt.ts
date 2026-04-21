export const onRequest: PagesFunction = async () => {
  return new Response("311cde31e9674a55a90e99ba3ce0c3ea", {
    headers: { "Content-Type": "text/plain" },
  });
};
