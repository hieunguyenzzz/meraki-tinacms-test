import NotFoundBody from '../../components/NotFoundBody';

// 404 boundary for the [lang] tree. src/app/[lang]/layout.tsx supplies the
// document shell plus the header and footer, so only the message goes here.
export default function NotFound() {
  return <NotFoundBody />;
}
