// The <head> contents shared by both root layouts. Kept in one place so the
// font preconnects cannot drift between the locale tree and the bare routes.
export default function DocumentHead() {
  return (
    <>
      <link rel='preconnect' href='https://fonts.googleapis.com' />
      <link
        rel='preconnect'
        href='https://fonts.gstatic.com'
        crossOrigin='anonymous'
      />
      <link
        rel='stylesheet'
        href='https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap'
      />
    </>
  );
}
